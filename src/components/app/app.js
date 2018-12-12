import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form/';

import './app.css';

export default class App extends Component  {

    maxId = 0;
    currentId(id) {
        return this.state.todoData.findIndex((el) => el.id === id);
    };

    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Build Awesome App'),
            this.createTodoItem('Have a lunch')
        ],
        term: '',
        filter: 'all'
    };

    createTodoItem(label) {
        return {
            label,
            done: false,
            important: false,
            id: this.maxId++
        };
    };

    deleteItem = (id) => {
        this.setState(({ todoData }) => {

            const newArray = [
                ...todoData.slice(0, this.currentId(id)), 
                ...todoData.slice(this.currentId(id) + 1)
            ];

            return {
                todoData: newArray
            };
        });
    };

    addItem = (label) => {
        this.setState(({ todoData }) => {
            const newItem = this.createTodoItem(label);
            const newArray = [
                ...todoData,
                newItem
            ];
            return {
                todoData: newArray
            };
        });
    };

    toggleProperty(arr, id, propName) {
        const index = this.currentId(id);

        const oldItem = arr[index];
        const newItem = { ...oldItem, [propName]: !oldItem[propName] };
        
        const newArray = [
            ...arr.slice(0, index),
            newItem,
            ...arr.slice(index + 1)
        ];
        return {
            todoData: newArray
        };
    }

    onToggleDone = (id) => {
        this.setState(({ todoData }) => {
            return this.toggleProperty(todoData, id, 'done');
        });
    };

    onToggleImportant = (id) => {
        this.setState(({ todoData }) => {
            return this.toggleProperty(todoData, id, 'important');
        });
    };
    
    search(items, term) {
        if (term.length == 0) {
            return items;
        }

        return items.filter((item) => {
            return item.label.indexOf(term) !== -1;
        });
    }

    onSearchChange = (term) => {
        this.setState({ term });
    };

    onFilterChange = (filter) => {
        this.setState({ filter });
    };

    filter(items, filter) {
        switch(filter) {
            case 'all':
                return items;
            case 'active':
                return items.filter((item) => !item.done);
            case 'done':
                return items.filter((item) => item.done);
            default:
                return items;
        }
    }

    render() {

        const { todoData, term, filter } = this.state;

        const visibleItems = this.filter(this.search(todoData, term), filter);

        const doneCount = todoData.filter((el) => el.done).length;

        const todoCount = todoData.length - doneCount;

        return (
            <div className="todo-app">
                <AppHeader toDo={ todoCount } done={ doneCount } />
                <div className="top-panel">
                    <SearchPanel
                        onSearchChange={ this.onSearchChange }/>
                    <ItemStatusFilter
                        filter={ filter }
                        onFilterChange={ this.onFilterChange }/>
                </div>
                
                <TodoList
                    todos={ visibleItems }
                    onDeleted={ this.deleteItem }
                    onToggleDone={ this.onToggleDone }
                    onToggleImportant={ this.onToggleImportant } />

                <ItemAddForm
                    onAdded={ this.addItem } />
            </div>
        );
    }
}