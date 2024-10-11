'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Play,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  Code,
  Search,
  Send,
} from 'lucide-react'
import jsonpath from 'jsonpath'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'



export default function Component() {
  const [payloads, setPayloads] = useState([])
  const [selectedPayload, setSelectedPayload] = useState(null)
  const [activeTab, setActiveTab] = useState('headers')
  const [showResponse, setShowResponse] = useState(false)
  const [responseQuery, setResponseQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [selectedFields, setSelectedFields] = useState([])
  const [newPayloadDialogOpen, setNewPayloadDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [aiModels, setAiModels] = useState(['GPT-4', 'DALL-E', 'Custom Model'])
  const [selectedAiModel, setSelectedAiModel] = useState('GPT-4')
  const [routines, setRoutines] = useState([])
  const [currentRoutine, setCurrentRoutine] = useState(null)
  const [routineDialogOpen, setRoutineDialogOpen] = useState(false)
  const [newRoutineName, setNewRoutineName] = useState('')

  useEffect(() => {
    fetchPayloads()
    fetchRoutines()
  }, [])

  const fetchPayloads = async () => {
    try
    {
      const response = await fetch('/api/payloads')
      if (response.ok)
      {
        const data = await response.json()
        setPayloads(data)
        if (data.length > 0)
        {
          setSelectedPayload(data[0])
          setSelectedAiModel(data[0].aiModel || 'GPT-4')
          setCurrentRoutine(data[0].routine || null)
        }
      } else
      {
        toast.error('Failed to fetch payloads from database.')
      }
    } catch (error)
    {
      console.error('Error fetching payloads:', error)
      toast.error('Error fetching payloads from database.')
    }
  }
  const PayloadsTable = ({ payloads, onEdit, onDelete }) => {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payloads.map((payload) => (
            <TableRow key={payload.id}>
              <TableCell>{payload.name}</TableCell>
              <TableCell>{payload.method}</TableCell>
              <TableCell>{payload.url}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(payload)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(payload.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  const ConfirmDialog = ({ trigger, title, description, onConfirm }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }


  const CodeBlock = ({ code, language }) => (
    <SyntaxHighlighter language={language} style={materialDark} wrapLongLines>
      {code}
    </SyntaxHighlighter>
  )


  const fetchRoutines = async () => {
    try
    {
      const response = await fetch('/api/routines')
      if (response.ok)
      {
        const data = await response.json()
        setRoutines(data)
      } else
      {
        toast.error('Failed to fetch routines from database.')
      }
    } catch (error)
    {
      console.error('Error fetching routines:', error)
      toast.error('Error fetching routines from database.')
    }
  }

  const handleAddHeader = () => {
    setSelectedPayload({
      ...selectedPayload,
      headers: [...selectedPayload.headers, { key: '', value: '' }],
    })
  }

  const handleAddQueryParam = () => {
    setSelectedPayload({
      ...selectedPayload,
      queryParams: [...selectedPayload.queryParams, { key: '', value: '' }],
    })
  }

  const handleAddVariable = () => {
    setSelectedPayload({
      ...selectedPayload,
      variables: [...selectedPayload.variables, { key: '', value: '' }],
    })
  }

  const handleUpdatePayload = async () => {
    try
    {
      if (!selectedPayload.url)
      {
        setErrorMessage('URL is required.')
        toast.error('URL is required.')
        return
      }

      if (selectedPayload.body)
      {
        try
        {
          JSON.parse(selectedPayload.body)
        } catch (error)
        {
          setErrorMessage('Invalid JSON in body.')
          toast.error('Invalid JSON in body.')
          return
        }
      }

      const payloadData = {
        name: selectedPayload.name,
        description: selectedPayload.description,
        url: selectedPayload.url,
        method: selectedPayload.method,
        headers: selectedPayload.headers,
        queryParams: selectedPayload.queryParams,
        body: selectedPayload.body,
        variables: selectedPayload.variables,
        response: selectedPayload.response,
        aiModel: selectedAiModel,
        routine: currentRoutine,
      }

      const response = await fetch(`/api/payloads/${selectedPayload._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadData),
      })

      if (response.ok)
      {
        const updatedPayload = await response.json()
        setPayloads(
          payloads.map((p) => (p._id === updatedPayload.data._id ? updatedPayload.data : p))
        )
        setSelectedPayload(updatedPayload.data)
        toast.success('Payload updated successfully.')
        setErrorMessage('')
      } else
      {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update payload.')
      }
    } catch (error)
    {
      console.error('Error updating payload:', error)
      toast.error('Error updating payload.')
    }
  }

  const handleInputChange = (section, index, field, value) => {
    const updatedSection = [...selectedPayload[section]]
    updatedSection[index][field] = value
    setSelectedPayload({ ...selectedPayload, [section]: updatedSection })
  }

  const renderTable = (section, columns) => (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col}>{col}</TableHead>
          ))}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selectedPayload[section].map((item, index) => (
          <TableRow key={index}>
            {columns.map((col) => (
              <TableCell key={col}>
                <Input
                  value={item[col.toLowerCase()]}
                  onChange={(e) =>
                    handleInputChange(section, index, col.toLowerCase(), e.target.value)
                  }
                />
              </TableCell>
            ))}
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const updatedSection = selectedPayload[section].filter((_, i) => i !== index)
                  setSelectedPayload({ ...selectedPayload, [section]: updatedSection })
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const handleQueryResponse = () => {
    try
    {
      const responseBody = JSON.parse(selectedPayload.response.body)
      const result = jsonpath.query(responseBody, responseQuery)
      setQueryResult(JSON.stringify(result, null, 2))
    } catch (error)
    {
      setQueryResult(`Error: ${error.message}`)
    }
  }

  const handleSelectField = (field) => {
    if (selectedFields.includes(field))
    {
      setSelectedFields(selectedFields.filter((f) => f !== field))
    } else
    {
      setSelectedFields([...selectedFields, field])
    }
  }

  const handleSendRequest = async () => {
    try
    {
      if (!selectedPayload.url)
      {
        setErrorMessage('URL is required.')
        toast.error('URL is required.')
        return
      }

      let headers = {}
      selectedPayload.headers.forEach((header) => {
        headers[header.key] = header.value
      })

      let url = new URL(selectedPayload.url)
      selectedPayload.queryParams.forEach((param) => {
        url.searchParams.append(param.key, param.value)
      })

      let body = selectedPayload.body
      if (body)
      {
        try
        {
          body = JSON.stringify(JSON.parse(body))
        } catch (error)
        {
          setErrorMessage('Invalid JSON in body.')
          toast.error('Invalid JSON in body.')
          return
        }
      }

      const response = await fetch(url.toString(), {
        method: selectedPayload.method,
        headers: headers,
        body: selectedPayload.method !== 'GET' ? body : null,
      })

      const responseText = await response.text()

      setSelectedPayload({
        ...selectedPayload,
        response: {
          status: response.status,
          body: responseText,
        },
      })

      toast.success('Request sent successfully.')
      setErrorMessage('')
      setShowResponse(true)
    } catch (error)
    {
      console.error('Error sending request:', error)
      toast.error('Error sending request.')
    }
  }

  const createNewPayload = async () => {
    try
    {
      const newPayload = {
        name: 'New Payload',
        description: '',
        url: '',
        method: 'GET',
        headers: [],
        queryParams: [],
        body: '',
        variables: [],
        response: {
          status: '',
          body: '',
        },
        aiModel: 'GPT-4',
        routine: null,
      }

      const response = await fetch('/api/payloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPayload),
      })

      if (response.ok)
      {
        const data = await response.json()
        setPayloads([...payloads, data.data])
        setSelectedPayload(data.data)
        toast.success('New payload created successfully.')
        setNewPayloadDialogOpen(false)
      } else
      {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create payload.')
      }
    } catch (error)
    {
      console.error('Error creating payload:', error)
      toast.error('Error creating payload.')
    }
  }

  const deletePayload = async (id) => {
    try
    {
      const response = await fetch(`/api/payloads/${id}`, {
        method: 'DELETE',
      })

      if (response.ok)
      {
        setPayloads(payloads.filter((p) => p._id !== id))
        if (selectedPayload._id === id)
        {
          setSelectedPayload(payloads[0] || null)
        }
        toast.success('Payload deleted successfully.')
      } else
      {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete payload.')
      }
    } catch (error)
    {
      console.error('Error deleting payload:', error)
      toast.error('Error deleting payload.')
    }
  }

  const handleAiModelChange = (model) => {
    setSelectedAiModel(model)
    setSelectedPayload({ ...selectedPayload, aiModel: model })
  }

  const handleRoutineChange = (routine) => {
    setCurrentRoutine(routine)
    setSelectedPayload({ ...selectedPayload, routine: routine })
  }

  const createNewRoutine = async () => {
    try
    {
      const newRoutine = {
        name: newRoutineName,
        payloads: [selectedPayload._id],
      }

      const response = await fetch('/api/routines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoutine),
      })

      if (response.ok)
      {
        const data = await response.json()
        setRoutines([...routines, data.data])
        setCurrentRoutine(data.data._id)
        toast.success('New routine created successfully.')
        setRoutineDialogOpen(false)
        setNewRoutineName('')
      } else
      {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create routine.')
      }
    } catch (error)
    {
      console.error('Error creating routine:', error)
      toast.error('Error creating routine.')
    }
  }

  return (
    <div className="space-y-8">
      <ToastContainer />
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Enhanced Payload Builder</CardTitle>
          <CardDescription>
            Create, manage, and analyze API payloads and responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Label className="font-bold">Select Payload:</Label>
              <Select
                value={selectedPayload ? selectedPayload._id : ''}
                onValueChange={(value) => {
                  const payload = payloads.find((p) => p._id === value)
                  setSelectedPayload(payload)
                  setShowResponse(false)
                  setQueryResult(null)
                }}
              >
                <SelectTrigger className="w-64 bg-gray-700 text-white">
                  <SelectValue placeholder="Select a payload" />
                </SelectTrigger>
                <SelectContent>
                  {payloads.map((payload) => (
                    <SelectItem key={payload._id} value={payload._id}>
                      {payload.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={newPayloadDialogOpen} onOpenChange={setNewPayloadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex  items-center">
                    <Plus className="mr-2 h-4 w-4" /> New Payload
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Payload</DialogTitle>
                    <DialogDescription>
                      Click "Confirm" to create a new payload.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 flex justify-end space-x-4">
                    <Button variant="ghost" onClick={() => setNewPayloadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createNewPayload}>
                      <Plus className="mr-2 h-4 w-4" /> Confirm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              {selectedPayload && (
                <Button
                  variant="destructive"
                  onClick={() => deletePayload(selectedPayload._id)}
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Payload
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label className="font-bold">AI Model:</Label>
                <Select
                  value={selectedAiModel}
                  onValueChange={handleAiModelChange}
                  className="bg-gray-700 text-white"
                >
                  <SelectTrigger className="w-48 bg-gray-700 text-white">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((model, index) => (
                      <SelectItem key={index} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label className="font-bold">Routine:</Label>
                <Select
                  value={currentRoutine || ''}
                  onValueChange={handleRoutineChange}
                  className="bg-gray-700 text-white"
                >
                  <SelectTrigger className="w-48 bg-gray-700 text-white">
                    <SelectValue placeholder="Select routine" />
                  </SelectTrigger>
                  <SelectContent>
                    {routines.map((routine) => (
                      <SelectItem key={routine._id} value={routine._id}>
                        {routine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={routineDialogOpen} onOpenChange={setRoutineDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" /> New Routine
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 text-white">
                    <DialogHeader>
                      <DialogTitle>Create New Routine</DialogTitle>
                      <DialogDescription>
                        Enter a name for the new routine.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                      <Input
                        value={newRoutineName}
                        onChange={(e) => setNewRoutineName(e.target.value)}
                        placeholder="Routine name"
                      />
                      <div className="flex justify-end space-x-4">
                        <Button variant="ghost" onClick={() => setRoutineDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createNewRoutine}>
                          <Plus className="mr-2 h-4 w-4" /> Create Routine
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="queryParams">Query Params</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>
            <TabsContent value="headers">
              {renderTable('headers', ['Key', 'Value'])}
              <Button onClick={handleAddHeader} className="mt-4 flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Add Header
              </Button>
            </TabsContent>
            <TabsContent value="queryParams">
              {renderTable('queryParams', ['Key', 'Value'])}
              <Button onClick={handleAddQueryParam} className="mt-4 flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Add Query Param
              </Button>
            </TabsContent>
            <TabsContent value="body">
              <Textarea
                value={selectedPayload.body}
                onChange={(e) =>
                  setSelectedPayload({ ...selectedPayload, body: e.target.value })
                }
                className="h-48 font-mono bg-gray-700 text-white"
                placeholder="Enter request body (JSON)"
              />
            </TabsContent>
            <TabsContent value="variables">
              {renderTable('variables', ['Key', 'Value'])}
              <Button onClick={handleAddVariable} className="mt-4 flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Add Variable
              </Button>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button onClick={handleUpdatePayload} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" /> Update Payload
            </Button>
            <Button onClick={handleSendRequest} className="flex items-center">
              <Send className="mr-2 h-4 w-4" /> Send Request
            </Button>
          </div>

          {selectedPayload && showResponse && (
            <div className="mt-8">
              <Card className="bg-gray-800 bg-opacity-50 text-white">
                <CardHeader>
                  <CardTitle>Response</CardTitle>
                  <CardDescription>
                    View and query the response from the API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Status Code</Label>
                      <Input
                        value={selectedPayload.response.status}
                        readOnly
                        className="bg-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label>Response Body</Label>
                      <CodeBlock
                        language="json"
                        code={selectedPayload.response.body}
                      />
                    </div>
                    <div>
                      <Label>Query Response (JSONPath)</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={responseQuery}
                          onChange={(e) => setResponseQuery(e.target.value)}
                          placeholder="e.g., $.preferences.theme"
                        />
                        <Button onClick={handleQueryResponse} className="flex items-center">
                          <Search className="mr-2 h-4 w-4" /> Query
                        </Button>
                      </div>
                    </div>
                    {queryResult && (
                      <div>
                        <Label>Query Result</Label>
                        <CodeBlock language="json" code={queryResult} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPayload && (
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardHeader>
            <CardTitle>{showResponse ? 'Response Preview' : 'Payload Preview'}</CardTitle>
            <CardDescription>
              View the formatted {showResponse ? 'response' : 'payload'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock
              language="json"
              code={JSON.stringify(
                showResponse
                  ? {
                    status: selectedPayload.response.status,
                    body: JSON.parse(selectedPayload.response.body || '{}'),
                  }
                  : {
                    name: selectedPayload.name,
                    description: selectedPayload.description,
                    url: selectedPayload.url,
                    method: selectedPayload.method,
                    headers: Object.fromEntries(
                      selectedPayload.headers.map((h) => [h.key, h.value])
                    ),
                    queryParams: Object.fromEntries(
                      selectedPayload.queryParams.map((q) => [q.key, q.value])
                    ),
                    body: selectedPayload.body,
                    variables: Object.fromEntries(
                      selectedPayload.variables.map((v) => [v.key, v.value])
                    ),
                    aiModel: selectedAiModel,
                    routine: currentRoutine,
                  },
                null,
                2
              )}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}