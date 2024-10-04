"use client";
/// components/Task.jsx
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { AlertCircle, Edit, Trash2, Info } from 'lucide-react';

const Task = ({ task, columnId, index, moveTask, updateTask, deleteTask, onEdit }) => {
    const ref = useRef(null);

    const [{ handlerId }, drop] = useDrop({
        accept: 'TASK',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current)
            {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            const sourceColumnId = item.columnId;

            if (dragIndex === hoverIndex && sourceColumnId === columnId)
            {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
            {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
            {
                return;
            }

            moveTask(item.id, sourceColumnId, columnId, hoverIndex);
            item.index = hoverIndex;
            item.columnId = columnId;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: () => {
            return { id: task.id, index, columnId };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));

    const getPriorityColor = (priority) => {
        switch (priority)
        {
            case 'Low': return 'bg-green-500 text-white';
            case 'Medium': return 'bg-yellow-500 text-white';
            case 'High': return 'bg-orange-500 text-white';
            case 'Critical': return 'bg-red-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <div ref={ref} style={{ opacity }} data-handler-id={handlerId}
            className={`bg-gray-700 p-4 rounded-lg shadow-md transition-all duration-300 ${isDragging ? 'opacity-50 scale-95' : 'hover:shadow-cyan-500/30'
                }`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{task.title}</h3>
                <div className="flex space-x-2">
                    <Info
                        size={20}
                        className="text-gray-400 cursor-pointer hover:text-green-500"
                        onClick={() => {/* Toggle task details */ }}
                    />
                    <Edit
                        size={20}
                        className="text-gray-400 cursor-pointer hover:text-cyan-500"
                        onClick={onEdit}
                    />
                    <Trash2
                        size={20}
                        className="text-gray-400 cursor-pointer hover:text-red-500"
                        onClick={() => deleteTask(task.id)}
                    />
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-2">{task.assignedTo}</p>
            <div className="flex justify-between items-center">
                <span className="text-xs bg-gray-600 px-2 py-1 rounded">{task.segment}</span>
                <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                </span>
            </div>
            <div className="mt-2 flex items-center text-xs text-red-400">
                <AlertCircle size={12} className="mr-1" />
                Due: {task.dueDate}
            </div>
        </div>
    );
};

export default Task;