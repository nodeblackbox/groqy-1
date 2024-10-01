'use client';
import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'
import { ChevronDown, ChevronRight, Edit, Trash2, Plus, Copy, Search } from 'lucide-react'



const GlobalVariablesManager = () => {

    const [variables, setVariables] = useState([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [newVariable, setNewVariable] = useState({ id: '', name: '', value: '', type: 'string', category: 'General' })
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedCategories, setExpandedCategories] = useState([])

    useEffect(() => {
        // Load variables from localStorage or API
        try
        {
            const storedVariables = JSON.parse(localStorage.getItem('globalVariables') || '[]')
            setVariables(Array.isArray(storedVariables) ? storedVariables : [])
        } catch (error)
        {
            console.error('Error loading variables:', error)
            setVariables([])
        }
    }, [])

    const saveVariables = (updatedVariables) => {
        setVariables(updatedVariables)
        try
        {
            localStorage.setItem('globalVariables', JSON.stringify(updatedVariables))
        } catch (error)
        {
            console.error('Error saving variables:', error)
            toast.error('Failed to save variables')
        }
    }

    const addVariable = () => {
        if (newVariable.name && newVariable.value)
        {
            const updatedVariables = [...variables, { ...newVariable, id: Date.now().toString() }]
            saveVariables(updatedVariables)
            setIsAddModalOpen(false)
            setNewVariable({ id: '', name: '', value: '', type: 'string', category: 'General' })
            toast.success('Variable added successfully')
        } else
        {
            toast.error('Please provide both name and value for the variable')
        }
    }

    const updateVariable = (id, updates) => {
        const updatedVariables = variables.map(v => v.id === id ? { ...v, ...updates } : v)
        saveVariables(updatedVariables)
        toast.success('Variable updated successfully')
    }

    const deleteVariable = (id) => {
        const updatedVariables = variables.filter(v => v.id !== id)
        saveVariables(updatedVariables)
        toast.success('Variable deleted successfully')
    }

    const toggleCategory = (category) => {
        setExpandedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    const filteredVariables = variables.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const groupedVariables = filteredVariables.reduce((acc, variable) => {
        if (!acc[variable.category])
        {
            acc[variable.category] = []
        }
        acc[variable.category].push(variable)
        return acc
    }, {})

    return (
        <div className="p-6 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Global Variables Manager</h1>

            <div className="mb-4 flex items-center space-x-4">
                <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search variables..."
                    className="flex-grow"
                    icon={<Search className="text-gray-400" />}
                />
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2" /> Add Variable
                </Button>
            </div>

            {Object.entries(groupedVariables).map(([category, vars]) => (
                <div key={category} className="mb-4">
                    <div
                        className="flex items-center cursor-pointer p-2 bg-gray-800 rounded"
                        onClick={() => toggleCategory(category)}
                    >
                        {expandedCategories.includes(category) ? (
                            <ChevronDown className="mr-2" />
                        ) : (
                            <ChevronRight className="mr-2" />
                        )}
                        <h2 className="text-xl font-semibold">{category}</h2>
                    </div>
                    {expandedCategories.includes(category) && (
                        <div className="mt-2 space-y-2">
                            {vars.map(variable => (
                                <div key={variable.id} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                                    <div>
                                        <span className="font-medium">{variable.name}: </span>
                                        <span className="text-gray-300">{variable.value}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                navigator.clipboard.writeText(variable.value)
                                                toast.success('Value copied to clipboard')
                                            }}
                                        >
                                            <Copy size={16} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setNewVariable(variable)
                                                setIsAddModalOpen(true)
                                            }}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => deleteVariable(variable.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{newVariable.id ? 'Edit Variable' : 'Add New Variable'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            value={newVariable.name}
                            onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                            placeholder="Variable Name"
                        />
                        <Input
                            value={newVariable.value}
                            onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                            placeholder="Variable Value"
                        />
                        <Select
                            value={newVariable.type}
                            onValueChange={(value) => setNewVariable({ ...newVariable, type: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select variable type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="string">String</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="object">Object</SelectItem>
                                <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            value={newVariable.category}
                            onChange={(e) => setNewVariable({ ...newVariable, category: e.target.value })}
                            placeholder="Category (e.g., API Keys, User Preferences)"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setIsAddModalOpen(false)} variant="outline">Cancel</Button>
                        <Button onClick={newVariable.id ? () => updateVariable(newVariable.id, newVariable) : addVariable}>
                            {newVariable.id ? 'Update' : 'Add'} Variable
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default GlobalVariablesManager;