"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { Toast } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Plus, ChevronDown, ChevronUp, Save, Trash, Image, Music, FileText } from 'lucide-react'
import Editor from '@monaco-editor/react'

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const authTypes = ['None', 'API Key', 'Bearer Token', 'Basic Auth']

const KeyValueTable = ({ items, onAdd, onChange, onRemove }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>KEY</TableHead>
                <TableHead>VALUE</TableHead>
                <TableHead></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {items.map((item, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <Input value={item.key} onChange={(e) => onChange(index, 'key', e.target.value)} />
                    </TableCell>
                    <TableCell>
                        <Input value={item.value} onChange={(e) => onChange(index, 'value', e.target.value)} />
                    </TableCell>
                    <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => onRemove(index)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
            <TableRow>
                <TableCell colSpan={3}>
                    <Button onClick={onAdd} variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add
                    </Button>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
)

const ResponseViewer = ({ response }) => {
    if (!response) return null

    const renderContent = () => {
        switch (response.type)
        {
            case 'json':
                return (
                    <Editor
                        height="300px"
                        defaultLanguage="json"
                        value={JSON.stringify(response.body, null, 2)}
                        options={{ readOnly: true }}
                    />
                )
            case 'image':
                return <img src={response.body} alt="Response" className="max-w-full h-auto" />
            case 'audio':
                return <audio controls src={response.body} className="w-full" />
            case 'text':
                return <pre className="whitespace-pre-wrap">{response.body}</pre>
            default:
                return <p>Unsupported response type</p>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <span className="font-bold">{response.status} {response.statusText}</span>
                <span>{response.size} bytes</span>
                <span>{response.time}ms</span>
            </div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="body">
                    <AccordionTrigger>Body</AccordionTrigger>
                    <AccordionContent>
                        {renderContent()}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="headers">
                    <AccordionTrigger>Headers</AccordionTrigger>
                    <AccordionContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>KEY</TableHead>
                                    <TableHead>VALUE</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(response.headers).map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell>{key}</TableCell>
                                        <TableCell>{value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cookies">
                    <AccordionTrigger>Cookies</AccordionTrigger>
                    <AccordionContent>
                        {response.cookies.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NAME</TableHead>
                                        <TableHead>VALUE</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {response.cookies.map((cookie, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{cookie.name}</TableCell>
                                            <TableCell>{cookie.value}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>No Cookies</p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

const RequestSlider = ({ requests, currentIndex, onChange }) => (
    <div className="w-full space-y-2">
        <Slider
            min={0}
            max={requests.length - 1}
            step={1}
            value={[currentIndex]}
            onValueChange={(value) => onChange(value[0])}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
            {requests.map((_, index) => (
                <span key={index}>{index + 1}</span>
            ))}
        </div>
    </div>
)

export default function AdvancedApiTester() {
    const [requests, setRequests] = useState([])
    const [currentRequestIndex, setCurrentRequestIndex] = useState(0)
    const [method, setMethod] = useState('GET')
    const [url, setUrl] = useState('')
    const [variables, setVariables] = useState([])
    const [authType, setAuthType] = useState('None')
    const [authValue, setAuthValue] = useState('')
    const [cookies, setCookies] = useState([])
    const [headers, setHeaders] = useState([
        { key: 'Content-Type', value: 'application/json' }
    ])
    const [queryParams, setQueryParams] = useState([])
    const [body, setBody] = useState('')
    const [response, setResponse] = useState(null)
    const [lastRequestTime, setLastRequestTime] = useState(null)
    const { toast } = useToast()

    useEffect(() => {
        const savedRequests = localStorage.getItem('savedRequests')
        if (savedRequests)
        {
            setRequests(JSON.parse(savedRequests))
        }
    }, [])

    useEffect(() => {
        if (requests.length > 0)
        {
            const currentRequest = requests[currentRequestIndex]
            setMethod(currentRequest.method)
            setUrl(currentRequest.url)
            setVariables(currentRequest.variables)
            setAuthType(currentRequest.authType)
            setAuthValue(currentRequest.authValue)
            setCookies(currentRequest.cookies)
            setHeaders(currentRequest.headers)
            setQueryParams(currentRequest.queryParams)
            setBody(currentRequest.body)
        }
    }, [currentRequestIndex, requests])

    const handleSaveRequest = () => {
        const newRequest = {
            method,
            url,
            variables,
            authType,
            authValue,
            cookies,
            headers,
            queryParams,
            body
        }
        const updatedRequests = [...requests, newRequest]
        setRequests(updatedRequests)
        localStorage.setItem('savedRequests', JSON.stringify(updatedRequests))
        toast({
            title: "Request saved",
            description: "Your request has been saved to local storage.",
        })
    }

    const handleSendRequest = async () => {
        setLastRequestTime(new Date())
        try
        {
            const response = await fetch(url, {
                method,
                headers: Object.fromEntries(headers.map(h => [h.key, h.value])),
                body: method !== 'GET' ? body : undefined
            })

            const contentType = response.headers.get('content-type')
            let responseBody
            let responseType

            if (contentType.includes('application/json'))
            {
                responseBody = await response.json()
                responseType = 'json'
            } else if (contentType.includes('image'))
            {
                responseBody = URL.createObjectURL(await response.blob())
                responseType = 'image'
            } else if (contentType.includes('audio'))
            {
                responseBody = URL.createObjectURL(await response.blob())
                responseType = 'audio'
            } else
            {
                responseBody = await response.text()
                responseType = 'text'
            }

            setResponse({
                status: response.status,
                statusText: response.statusText,
                size: responseBody.length,
                time: new Date() - lastRequestTime,
                body: responseBody,
                type: responseType,
                headers: Object.fromEntries(response.headers.entries()),
                cookies: response.headers.get('set-cookie')?.split(', ') || []
            })
        } catch (error)
        {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const handleAddItem = (setter) => {
        setter(prev => [...prev, { key: '', value: '' }])
    }

    const handleChangeItem = (index, field, value, setter) => {
        setter(prev => {
            const newItems = [...prev]
            newItems[index][field] = value
            return newItems
        })
    }

    const handleRemoveItem = (index, setter) => {
        setter(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex items-center space-x-2">
                <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent>
                        {httpMethods.map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Enter URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-grow"
                />
                <Button onClick={handleSendRequest}>SEND REQUEST</Button>
                <Button onClick={handleSaveRequest} variant="outline">
                    <Save className="mr-2 h-4 w-4" /> Save
                </Button>
            </div>
            {lastRequestTime && (
                <div className="text-sm text-muted-foreground">
                    Last request: {lastRequestTime.toLocaleTimeString()}
                </div>
            )}
            {requests.length > 0 && (
                <RequestSlider
                    requests={requests}
                    currentIndex={currentRequestIndex}
                    onChange={setCurrentRequestIndex}
                />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="multiple" className="w-full">
                            <AccordionItem value="variables">
                                <AccordionTrigger>Variables</AccordionTrigger>
                                <AccordionContent>
                                    <KeyValueTable
                                        items={variables}
                                        onAdd={() => handleAddItem(setVariables)}
                                        onChange={(index, field, value) => handleChangeItem(index, field, value, setVariables)}
                                        onRemove={(index) => handleRemoveItem(index, setVariables)}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="auth">
                                <AccordionTrigger>Authentication</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        <Select value={authType} onValueChange={setAuthType}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select auth type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {authTypes.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {authType !== 'None' && (
                                            <Input
                                                placeholder={`Enter ${authType}`}
                                                value={authValue}
                                                onChange={(e) => setAuthValue(e.target.value)}
                                            />
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="cookies">
                                <AccordionTrigger>Cookies</AccordionTrigger>
                                <AccordionContent>
                                    <KeyValueTable
                                        items={cookies}
                                        onAdd={() => handleAddItem(setCookies)}
                                        onChange={(index, field, value) => handleChangeItem(index, field, value, setCookies)}
                                        onRemove={(index) => handleRemoveItem(index, setCookies)}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="headers">
                                <AccordionTrigger>Headers</AccordionTrigger>
                                <AccordionContent>
                                    <KeyValueTable
                                        items={headers}
                                        onAdd={() => handleAddItem(setHeaders)}
                                        onChange={(index, field, value) => handleChangeItem(index, field, value, setHeaders)}
                                        onRemove={(index) => handleRemoveItem(index, setHeaders)}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="queryParams">
                                <AccordionTrigger>Query Parameters</AccordionTrigger>
                                <AccordionContent>
                                    <KeyValueTable
                                        items={queryParams}
                                        onAdd={() => handleAddItem(setQueryParams)}
                                        onChange={(index, field, value) => handleChangeItem(index, field, value, setQueryParams)}
                                        onRemove={(index) => handleRemoveItem(index, setQueryParams)}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="body">
                                <AccordionTrigger>Body</AccordionTrigger>
                                <AccordionContent>
                                    <Editor
                                        height="300px"
                                        defaultLanguage="json"
                                        value={body}
                                        onChange={setBody}
                                        options={{
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            folding: true,
                                            lineNumbers: 'on',
                                            wordWrap: 'on',
                                            tabSize: 2,
                                        }}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[600px]">
                            <ResponseViewer response={response} />
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </div>
    )
}