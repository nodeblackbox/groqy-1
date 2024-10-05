// import React, { useState, useEffect, useCallback } from 'react';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import Column from './Column';
// import EditTaskModal from './EditTaskModal';
// import { fetchBoardData, saveBoardData } from '../../lib/api';
// import { toast } from 'react-hot-toast';
// import { Loader } from 'lucide-react';
// import { motion } from 'framer-motion';

// const KanbanBoard = () => {
//     const [boardData, setBoardData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [editingTask, setEditingTask] = useState(null);

//     useEffect(() => {
//         fetchBoardDataAndSet();
//     }, []);

//     const fetchBoardDataAndSet = async () => {
//         try
//         {
//             setLoading(true);
//             const data = await fetchBoardData();
//             const processedData = {
//                 ...data,
//                 columns: data.columns.map(column => ({
//                     ...column,
//                     tasks: column.tasks.map(task => ({
//                         ...task,
//                         id: task.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//                     }))
//                 }))
//             };
//             setBoardData(processedData);
//             setLoading(false);
//         } catch (err)
//         {
//             setError('Failed to load board data');
//             setLoading(false);
//             toast.error('Failed to load board data');
//         }
//     };

//     const moveTask = useCallback((taskId, sourceColumnId, targetColumnId, targetIndex) => {
//         setBoardData((prevData) => {
//             const updatedColumns = prevData.columns.map((column) => {
//                 if (column.id === sourceColumnId)
//                 {
//                     return {
//                         ...column,
//                         tasks: column.tasks.filter((task) => task.id !== taskId),
//                     };
//                 }
//                 if (column.id === targetColumnId)
//                 {
//                     const [movedTask] = prevData.columns
//                         .find((col) => col.id === sourceColumnId)
//                         .tasks.filter((task) => task.id === taskId);

//                     const updatedTask = { ...movedTask, status: column.title };
//                     const newTasks = [...column.tasks];
//                     newTasks.splice(targetIndex, 0, updatedTask);

//                     return { ...column, tasks: newTasks };
//                 }
//                 return column;
//             });

//             const newBoardData = { ...prevData, columns: updatedColumns };
//             saveBoardData(newBoardData);
//             return newBoardData;
//         });
//     }, []);

//     const addTask = useCallback((columnId, status) => {
//         const newTask = {
//             id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//             title: "New Task",
//             description: "",
//             assignedTo: "Unassigned",
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//             dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//             priority: "Medium",
//             segment: "Unspecified",
//             status: status,
//             tags: [],
//             attachments: [],
//             comments: [],
//             checklist: [],
//             estimatedTime: 0,
//             actualTime: 0,
//             isArchived: false,
//             createdBy: "Current User",
//             lastModifiedBy: "Current User"
//         };

//         setBoardData((prevData) => {
//             const updatedColumns = prevData.columns.map((column) => {
//                 if (column.id === columnId)
//                 {
//                     return { ...column, tasks: [...column.tasks, newTask] };
//                 }
//                 return column;
//             });

//             const newBoardData = { ...prevData, columns: updatedColumns };
//             saveBoardData(newBoardData);
//             return newBoardData;
//         });
//     }, []);

//     const updateTask = useCallback((updatedTask) => {
//         setBoardData((prevData) => {
//             const updatedColumns = prevData.columns.map((column) => ({
//                 ...column,
//                 tasks: column.tasks.map((task) =>
//                     task.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : task
//                 )
//             }));

//             const newBoardData = { ...prevData, columns: updatedColumns };
//             saveBoardData(newBoardData);
//             return newBoardData;
//         });
//         setEditingTask(null);
//     }, []);

//     const deleteTask = useCallback((taskId) => {
//         setBoardData((prevData) => {
//             const updatedColumns = prevData.columns.map((column) => ({
//                 ...column,
//                 tasks: column.tasks.filter((task) => task.id !== taskId),
//             }));

//             const newBoardData = { ...prevData, columns: updatedColumns };
//             saveBoardData(newBoardData);
//             return newBoardData;
//         });
//     }, []);

//     if (loading)
//     {
//         return (
//             <div className="flex justify-center items-center h-screen bg-gray-900">
//                 <Loader className="animate-spin text-cyan-500" size={48} />
//             </div>
//         );
//     }

//     if (error)
//     {
//         return <div className="text-red-500 text-center">{error}</div>;
//     }

//     return (
//         <DndProvider backend={HTML5Backend}>
//             <div className="bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen p-8 text-white">
//                 <motion.h1
//                     className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"
//                     initial={{ opacity: 0, y: -50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     {boardData.projectName}
//                 </motion.h1>
//                 <motion.div
//                     className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                 >
//                     {boardData.columns.map((column, index) => (
//                         <motion.div
//                             key={column.id}
//                             initial={{ opacity: 0, x: -50 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.5, delay: index * 0.1 }}
//                         >
//                             <Column
//                                 column={column}
//                                 moveTask={moveTask}
//                                 addTask={addTask}
//                                 updateTask={updateTask}
//                                 deleteTask={deleteTask}
//                                 onEditTask={setEditingTask}
//                             />
//                         </motion.div>
//                     ))}
//                 </motion.div>
//             </div>
//             {editingTask && (
//                 <EditTaskModal
//                     task={editingTask}
//                     onSave={updateTask}
//                     onClose={() => setEditingTask(null)}
//                 />
//             )}
//         </DndProvider>
//     );
// };

// export default KanbanBoard;