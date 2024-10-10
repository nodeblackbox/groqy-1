import React from 'react';
import Task from './Task';
import { useDrop } from 'react-dnd';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Column = ({ column, moveTask, addTask, updateTask, deleteTask, onEditTask }) => {
    const [, drop] = useDrop({
        accept: 'TASK',
        drop: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (didDrop)
            {
                return;
            }
            const sourceColumnId = item.columnId;
            if (sourceColumnId !== column.id)
            {
                moveTask(item.id, sourceColumnId, column.id, column.tasks.length);
            }
        },
    });

    const handleAddTask = () => {
        addTask(column.id, column.title);
    };

    return (
        <motion.div
            ref={drop}
            className="bg-gray-800 bg-opacity-50 rounded-xl p-4 shadow-lg backdrop-filter backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="font-semibold mb-4 text-xl text-center text-cyan-300">{column.title}</h2>
            <div className="space-y-4">
                {column.tasks.map((task, index) => (
                    <Task
                        key={task.id}
                        task={task}
                        columnId={column.id}
                        index={index}
                        moveTask={moveTask}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                        onEdit={() => onEditTask(task)}
                    />
                ))}
            </div>
            <motion.button
                onClick={handleAddTask}
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <PlusCircle size={20} className="mr-2" />
                Add Task
            </motion.button>
        </motion.div>
    );
};

export default Column;