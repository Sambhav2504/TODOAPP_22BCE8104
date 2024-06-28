const Todo = require('../models/todo');


exports.getAllTodos = async (req, res) => {
    try {
        const allTodos = await Todo.find();
        return res.status(200).send(allTodos);
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(400).send({ message: 'Failed to fetch all todos' });
    }
};


exports.createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        const newTodo = new Todo({
            title,
            description
        });
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'Todo ID is required' });
        }
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description, completed },
            { new: true }
        );
        res.status(200).json(updatedTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Todo ID is required' });
        }
        const deletedTodo = await Todo.findByIdAndDelete(id);
        return res.status(200).send(deletedTodo);
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(400).send({ message: 'Failed to delete todo' });
    }
};
