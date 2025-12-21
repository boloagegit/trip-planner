import Papa from 'papaparse';

/**
 * Converts a standard Google Sheet URL to a CSV export URL.
 * @param {string} url - The Google Sheet URL.
 * @returns {string|null} - The CSV export URL or null if invalid.
 */
export const parseSheetUrl = (url) => {
    if (!url) return null;

    // Handle already correct CSV URLs
    if (url.includes('output=csv') || url.includes('format=csv')) return url;

    // Extract Sheet ID
    const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!matches || !matches[1]) return null;

    const sheetId = matches[1];

    // Extract GID if present
    const gidMatches = url.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatches ? gidMatches[1] : '0';

    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
};

/**
 * Extracts the Sheet ID from a Google Sheet URL.
 * @param {string} url - The Google Sheet URL.
 * @returns {string|null} - The Sheet ID or null.
 */
export const extractSheetId = (url) => {
    if (!url) return null;
    const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return matches ? matches[1] : null;
};

/**
 * Parses option syntax like "Title [{A: Option1}, {B: Option2}]"
 * Returns an array of options or null if no options found.
 * @param {string} text - The input text to parse
 * @returns {Array|null} - Array of {label, value} objects or null
 */
const parseOptions = (text) => {
    if (!text) return null;

    // Look for pattern starting with [ and ending with ] containing { key: value } structures
    const match = text.match(/\[\s*(\{.*?\})\s*\]/);
    if (!match) return null;

    const fullMatch = match[0]; // The whole [{...}, {...}] block

    // Remove outer brackets [ ]
    const content = fullMatch.substring(1, fullMatch.length - 1);

    // Split by "}," or "} ,"
    const rawOptions = content.split(/\}\s*,\s*\{/);

    const options = rawOptions.map(raw => {
        // Clean up leading/trailing braces
        let cleaned = raw.trim();
        if (cleaned.startsWith('{')) cleaned = cleaned.substring(1);
        if (cleaned.endsWith('}')) cleaned = cleaned.substring(0, cleaned.length - 1);

        // Split by first colon
        const separatorIndex = cleaned.indexOf(':');
        if (separatorIndex === -1) return null;

        const label = cleaned.substring(0, separatorIndex).trim();
        const value = cleaned.substring(separatorIndex + 1).trim();

        return { label, value };
    }).filter(opt => opt !== null);

    return options.length > 0 ? options : null;
};

/**
 * Parses the matrix-style CSV data into the application's itinerary format.
 * @param {Array} data - The parsed CSV data array (array of objects).
 * @returns {Array} - The formatted itinerary array.
 */
export const parseMatrixCSV = (data) => {
    if (!data || data.length === 0) return { itinerary: [], metadata: { title: 'Trip Planner', startDate: '', endDate: '' } };

    // The first row of data (from PapaParse with header:true) keys are the headers.
    // We need to identify which keys are dates.
    // The structure is: "時間", "12/28 (日)抵達", "12/29 (一)貓與牛舌", ...

    const sampleRow = data[0];
    const dateKeys = Object.keys(sampleRow).filter(key => key !== '時間' && key !== '');

    const eventsByDate = {};

    // Initialize date buckets
    dateKeys.forEach(key => {
        eventsByDate[key] = [];
    });

    data.forEach((row, rowIndex) => {
        const time = row['時間'];
        if (!time) return;

        dateKeys.forEach(dateKey => {
            const content = row[dateKey];
            if (content && content.trim()) {
                const title = content.trim();
                const options = parseOptions(title);

                eventsByDate[dateKey].push({
                    id: `sheet-${rowIndex}-${dateKey}`,
                    time: time.trim(),
                    title: title,
                    options: options,
                    description: '', // Description is merged into title in this simple format
                    type: inferType(content),
                    location: '',
                    image: '',
                    fixed: true // Assume sheet data is fixed/planned
                });
            }
        });
    });

    const itinerary = [];

    dateKeys.forEach(dateKey => {
        // Parse the date string to get a cleaner date and day of week
        // Format: "12/28 (日)抵達" -> Date: "12/28", Day: "週日" (mapped from (日))
        const { dateStr, dayOfWeek } = parseDateHeader(dateKey);

        const dayEvents = eventsByDate[dateKey];

        // Sort events by time
        dayEvents.sort((a, b) => {
            // Simple time sort "8:00" vs "12:00"
            return parseInt(a.time) - parseInt(b.time);
        });

        // Merge consecutive events with same title
        const mergedEvents = [];
        let currentEvent = null;

        dayEvents.forEach(event => {
            if (!currentEvent) {
                currentEvent = { ...event, endTime: null };
                return;
            }

            // Check if titles match
            if (event.title === currentEvent.title) {
                // Update range
                currentEvent.lastTimeBlock = event.time;
                // Keep the description if the current one is empty but the new one has it
                if (!currentEvent.description && event.description) {
                    currentEvent.description = event.description;
                }
            } else {
                // Push the previous event
                mergedEvents.push(finalizeEvent(currentEvent));
                currentEvent = { ...event, endTime: null };
            }
        });

        if (currentEvent) {
            mergedEvents.push(finalizeEvent(currentEvent));
        }

        itinerary.push({
            date: dateStr,
            dayOfWeek: dayOfWeek,
            events: mergedEvents
        });
    });

    // Extract metadata
    let metadata = {
        title: 'Trip Planner',
        startDate: '',
        endDate: ''
    };

    if (itinerary.length > 0) {
        metadata.startDate = itinerary[0].date;
        metadata.endDate = itinerary[itinerary.length - 1].date;
        // Try to construct a title from the date range or use a default
        metadata.title = `${metadata.startDate} - ${metadata.endDate} Trip`;
    }

    return { itinerary, metadata };
};

const finalizeEvent = (event) => {
    if (event.lastTimeBlock) {
        // User requested format: if 17:00, 18:00, 19:00, 20:00 are same, show "17:00 - 20:00"
        // So we simply use the start time of the last block as the end time of the range.
        event.displayTime = `${event.time} - ${event.lastTimeBlock}`;
    } else {
        event.displayTime = event.time;
    }
    delete event.lastTimeBlock;
    return event;
};

const inferType = (content) => {
    const lower = content.toLowerCase();
    if (lower.includes('食') || lower.includes('餐') || lower.includes('牛舌') || lower.includes('拉麵')) return 'food';
    if (lower.includes('機') || lower.includes('鐵') || lower.includes('車') || lower.includes('移動')) return 'transport';
    if (lower.includes('住') || lower.includes('飯店') || lower.includes('check-in')) return 'hotel';
    if (lower.includes('買') || lower.includes('逛')) return 'shopping';
    return 'sightseeing';
};

const parseDateHeader = (header) => {
    // Example: "12/28 (日)抵達"
    // We want to extract "12/28" and "(日)"

    const dateMatch = header.match(/(\d{1,2}\/\d{1,2})/);
    const dayMatch = header.match(/\(([一二三四五六日])\)/);

    const dateStr = dateMatch ? dateMatch[1] : header;

    let dayOfWeek = '未知';
    if (dayMatch) {
        const map = {
            '一': '週一', '二': '週二', '三': '週三', '四': '週四',
            '五': '週五', '六': '週六', '日': '週日'
        };
        dayOfWeek = map[dayMatch[1]] || '未知';
    }

    return { dateStr, dayOfWeek };
};
