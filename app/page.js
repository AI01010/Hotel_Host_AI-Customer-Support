'use client'
import {Box, Stack, TextField, Button, Typography, Image} from '@mui/material'
import {useState, useRef, useEffect} from 'react'

export default function Home()
{
  const [messages, setMessages] = useState
  ([{
    role: 'model',
    parts: [{text: "Hello! I'm the Hotel guest support assistant. How can I help you today?"}]  
  }])

  const [message, setMessage] = useState('')
  const sendMessage = async() =>
  {
    if (!message.trim()) return; //won't send empty messages
    setMessage('')
    try
    {    
      const response = await fetch
      (
      '/api/chat', 
      {
        method:"POST", 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify([...messages, {role: "user", parts: [{text: message}]}])
        
      }
      )
      const newMessage = await response.json()
      setMessages
      ([
        ...messages,
        {role: "user", parts: [{text: message}]},
        {role: "model", parts: [{text: newMessage}]},
      ])
    }
    catch (e)
    {
      console.log(e)
      setMessages
      ([
          ...messages,
          {role: "user", parts: [{text: message}]},
          {role: "model", parts: [{text: "I'm sorry, but I encountered an error, try again later."}]},
      ])
    }
  }
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current = document.getElementById(messages.length - 1)
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {scrollToBottom()}, [messages])

  return <Box 
  width="100vw" 
  height="100vh" 
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center">
    <Stack direction={'row'} display={'flex'}>
        <img src="android-chrome-192x192.png" alt="Description of Image" height={'75'} width={'75'}/>
        <Typography variant={'h4'} color={'#339fff'} padding={2}>
          Hotel Host AI
        </Typography>
      </Stack>
      
    <Stack
    direct="column"
    width="75%"
    height="85%"
    border="2px solid black"
    borderRadius={10}
    p={2}
    spacing={3}>
      <Stack
      direction="column"
      spacing={2}
      flexGrow={1}
      overflow="auto"
      maxHeight="100%">
        {
          messages.map((theMessage, index)=>
          (
            <Box 
            key={index}
            id={index}
            display='flex' 
            justifyContent={theMessage.role === "model" ? 'flex-start' : 'flex-end' }>
                <Box 
                bgcolor={theMessage.role === "model" ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                p={3}>
                {theMessage.parts[0].text}
                </Box>
            </Box>
          ))
        }
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField
        label="message"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}>
        </TextField>
        <Button variant = "contained" onClick = {sendMessage}>Send</Button>
      </Stack>
    </Stack>
  </Box>
}