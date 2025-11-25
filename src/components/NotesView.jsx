import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faTrain, faWallet, faCartShopping, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import './NotesView.css';

const STORAGE_KEY = 'trip_planner_notes';

const NotesView = () => {
    const [activeTab, setActiveTab] = useState('transport');
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        if (savedNotes) {
            try {
                return JSON.parse(savedNotes);
            } catch (e) {
                console.error('Failed to parse notes', e);
            }
        }
        return {
            transport: '',
            general: '',
            budget: [],
            shopping: []
        };
    });

    // Save to LocalStorage whenever notes change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }, [notes]);

    const handleTextChange = (field, value) => {
        setNotes(prev => ({ ...prev, [field]: value }));
    };

    // Budget Logic
    const [budgetInput, setBudgetInput] = useState({ item: '', amount: '' });
    const addBudgetItem = (e) => {
        e.preventDefault();
        if (!budgetInput.item || !budgetInput.amount) return;

        const newItem = {
            id: Date.now(),
            item: budgetInput.item,
            amount: parseFloat(budgetInput.amount)
        };

        setNotes(prev => ({
            ...prev,
            budget: [...prev.budget, newItem]
        }));
        setBudgetInput({ item: '', amount: '' });
    };

    const deleteBudgetItem = (id) => {
        setNotes(prev => ({
            ...prev,
            budget: prev.budget.filter(item => item.id !== id)
        }));
    };

    const budgetTotal = notes.budget.reduce((sum, item) => sum + item.amount, 0);

    // Shopping Logic
    const [shoppingInput, setShoppingInput] = useState('');
    const addShoppingItem = (e) => {
        e.preventDefault();
        if (!shoppingInput.trim()) return;

        const newItem = {
            id: Date.now(),
            item: shoppingInput,
            checked: false
        };

        setNotes(prev => ({
            ...prev,
            shopping: [...prev.shopping, newItem]
        }));
        setShoppingInput('');
    };

    const toggleShoppingItem = (id) => {
        setNotes(prev => ({
            ...prev,
            shopping: prev.shopping.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        }));
    };

    const deleteShoppingItem = (id) => {
        setNotes(prev => ({
            ...prev,
            shopping: prev.shopping.filter(item => item.id !== id)
        }));
    };

    return (
        <div className="notes-view">
            <div className="notes-tabs">
                <button
                    className={`notes-tab ${activeTab === 'transport' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transport')}
                >
                    <FontAwesomeIcon icon={faTrain} /> 交通/路線
                </button>
                <button
                    className={`notes-tab ${activeTab === 'budget' ? 'active' : ''}`}
                    onClick={() => setActiveTab('budget')}
                >
                    <FontAwesomeIcon icon={faWallet} /> 記帳
                </button>
                <button
                    className={`notes-tab ${activeTab === 'shopping' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shopping')}
                >
                    <FontAwesomeIcon icon={faCartShopping} /> 採買清單
                </button>
                <button
                    className={`notes-tab ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    <FontAwesomeIcon icon={faNoteSticky} /> 備忘錄
                </button>
            </div>

            <div className="notes-body">
                {activeTab === 'transport' && (
                    <textarea
                        className="notes-textarea"
                        placeholder="在此貼上交通轉乘資訊、路線規劃..."
                        value={notes.transport}
                        onChange={(e) => handleTextChange('transport', e.target.value)}
                    />
                )}

                {activeTab === 'general' && (
                    <textarea
                        className="notes-textarea"
                        placeholder="隨手記..."
                        value={notes.general}
                        onChange={(e) => handleTextChange('general', e.target.value)}
                    />
                )}

                {activeTab === 'budget' && (
                    <div className="budget-section">
                        <form onSubmit={addBudgetItem} className="notes-input-group">
                            <input
                                type="text"
                                className="notes-input"
                                placeholder="項目名稱 (例如: 午餐)"
                                value={budgetInput.item}
                                onChange={e => setBudgetInput({ ...budgetInput, item: e.target.value })}
                            />
                            <input
                                type="number"
                                className="notes-input notes-input-amount"
                                placeholder="金額"
                                value={budgetInput.amount}
                                onChange={e => setBudgetInput({ ...budgetInput, amount: e.target.value })}
                            />
                            <button type="submit" className="notes-add-btn">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </form>

                        <ul className="notes-list">
                            {notes.budget.map(item => (
                                <li key={item.id} className="notes-list-item">
                                    <div className="item-content">
                                        <span className="item-text">{item.item}</span>
                                        <span className="item-amount">¥{item.amount.toLocaleString()}</span>
                                    </div>
                                    <button
                                        className="item-delete"
                                        onClick={() => deleteBudgetItem(item.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className="budget-total">
                            <span>總支出</span>
                            <span className="total-amount">¥{budgetTotal.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                {activeTab === 'shopping' && (
                    <div className="shopping-section">
                        <form onSubmit={addShoppingItem} className="notes-input-group">
                            <input
                                type="text"
                                className="notes-input"
                                placeholder="想買什麼？"
                                value={shoppingInput}
                                onChange={e => setShoppingInput(e.target.value)}
                            />
                            <button type="submit" className="notes-add-btn">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </form>

                        <ul className="notes-list">
                            {notes.shopping.map(item => (
                                <li key={item.id} className="notes-list-item">
                                    <input
                                        type="checkbox"
                                        className="item-check"
                                        checked={item.checked}
                                        onChange={() => toggleShoppingItem(item.id)}
                                    />
                                    <div className="item-content">
                                        <span className={`item-text ${item.checked ? 'checked' : ''}`}>
                                            {item.item}
                                        </span>
                                    </div>
                                    <button
                                        className="item-delete"
                                        onClick={() => deleteShoppingItem(item.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesView;
