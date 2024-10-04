'use client'

import React, { useEffect, useRef } from 'react'

const BlackHoleEffect = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const bgUrl = 'https://images.news18.com/ibnlive/uploads/2016/05/Space.jpg?impolicy=website&width=640&height=480'

        let blackholeMass = 5500
        let curblackholeMass = 0

        let canvas, gl
        let shaderScript
        let shaderSource
        let vertexShader
        let fragmentShader
        let buffer
        let program

        let locationOfTime
        let locationOfResolution
        let locationOfMouse
        let locationOfMass
        let locationOfclickedTime

        let originY = window.innerHeight,
            originX = window.innerWidth

        let mouse, targetMouse

        let startTime = new Date().getTime()
        let currentTime = 0

        let clicked = false,
            clickedTime = 0

        function init(image) {
            canvas = canvasRef.current
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            canvas.width = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight
            canvas.height = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight

            mouse = { x: originX / 2, y: -(originY / 2) + canvas.height, moved: false }
            targetMouse = { x: mouse.x, y: mouse.y }

            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)

            buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([
                    -1.0, -1.0,
                    1.0, -1.0,
                    -1.0, 1.0,
                    -1.0, 1.0,
                    1.0, -1.0,
                    1.0, 1.0]),
                gl.STATIC_DRAW
            )

            const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;
        
        varying vec2 v_texCoord;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
            v_texCoord = a_texCoord;
        }
      `

            const fragmentShaderSource = `
        #ifdef GL_ES
        precision mediump float;
        #endif
        #define PI 3.14159265359
        uniform sampler2D u_image;
        varying vec2 v_texCoord;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_mass;
        uniform float u_time;
        uniform float u_clickedTime;
        vec2 rotate(vec2 mt, vec2 st, float angle){
            float cos = cos((angle + u_clickedTime) * PI);
            float sin = sin(angle * 0.0);
            
            float nx = (cos * (st.x - mt.x)) + (sin * (st.y - mt.y)) + mt.x;
            float ny = (cos * (st.y - mt.y)) - (sin * (st.x - mt.x)) + mt.y;
            return vec2(nx, ny);
        }
        void main() {
             vec2 st = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y)/u_resolution;
            vec2 mt = vec2(u_mouse.x, u_resolution.y - u_mouse.y)/u_resolution;
            float dx = st.x - mt.x;
            float dy = st.y - mt.y;
            float dist = sqrt(dx * dx + dy * dy);
            float pull = u_mass / (dist * dist);
            
             vec3 color = vec3(0.0);
            
            vec2 r = rotate(mt,st,pull);
            vec4 imgcolor = texture2D(u_image, r);
            color = vec3(
                (imgcolor.x - (pull * 0.25)),
                (imgcolor.y - (pull * 0.25)), 
                (imgcolor.z - (pull * 0.25))
            );
            
             gl_FragColor = vec4(color,1.);
        }
      `

            vertexShader = gl.createShader(gl.VERTEX_SHADER)
            gl.shaderSource(vertexShader, vertexShaderSource)
            gl.compileShader(vertexShader)

            fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
            gl.shaderSource(fragmentShader, fragmentShaderSource)
            gl.compileShader(fragmentShader)

            program = gl.createProgram()
            gl.attachShader(program, vertexShader)
            gl.attachShader(program, fragmentShader)
            gl.linkProgram(program)
            gl.useProgram(program)

            locationOfResolution = gl.getUniformLocation(program, "u_resolution")
            locationOfMouse = gl.getUniformLocation(program, "u_mouse")
            locationOfMass = gl.getUniformLocation(program, "u_mass")
            locationOfTime = gl.getUniformLocation(program, "u_time")
            locationOfclickedTime = gl.getUniformLocation(program, "u_clickedTime")

            gl.uniform2f(locationOfResolution, canvas.width, canvas.height)
            gl.uniform2f(locationOfMouse, mouse.x, mouse.y)
            gl.uniform1f(locationOfMass, curblackholeMass * 0.00001)
            gl.uniform1f(locationOfTime, currentTime)
            gl.uniform1f(locationOfclickedTime, clickedTime)

            const texCoordLocation = gl.getAttribLocation(program, "a_texCoord")

            const texCoordBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1.0, -1.0,
                1.0, -1.0,
                -1.0, 1.0,
                -1.0, 1.0,
                1.0, -1.0,
                1.0, 1.0]),
                gl.STATIC_DRAW)
            gl.enableVertexAttribArray(texCoordLocation)
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0)

            const texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D, texture)

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

            render()
        }

        function render() {
            const now = new Date().getTime()
            currentTime = (now - startTime) / 1000

            if (curblackholeMass < blackholeMass - 50)
            {
                curblackholeMass += (blackholeMass - curblackholeMass) * 0.03
            }

            if (clicked)
            {
                clickedTime += 0.03
            } else if (clickedTime > 0 && clicked == false)
            {
                clickedTime += -(clickedTime * 0.015)
            }

            if (mouse.moved == false)
            {
                mouse.y = (-(originY / 2) + Math.sin(currentTime * 0.7) * ((originY * 0.25))) + canvas.height
                mouse.x = (originX / 2) + Math.sin(currentTime * 0.6) * -(originX * 0.35)
            } else
            {
                mouse.x += (targetMouse.x - mouse.x) * 0.05
                mouse.y += (targetMouse.y - mouse.y) * 0.05
            }

            gl.uniform1f(locationOfMass, curblackholeMass * 0.00001)
            gl.uniform2f(locationOfMouse, mouse.x, mouse.y)
            gl.uniform1f(locationOfTime, currentTime)
            gl.uniform1f(locationOfclickedTime, clickedTime)

            window.requestAnimationFrame(render)

            const positionLocation = gl.getAttribLocation(program, "a_position")
            gl.enableVertexAttribArray(positionLocation)
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
            gl.drawArrays(gl.TRIANGLES, 0, 6)
        }

        const image = new Image()
        image.crossOrigin = "Anonymous"
        image.src = bgUrl
        image.onload = function () {
            init(image)
        }

        function handleMouseMove(e) {
            targetMouse.x = e.pageX
            targetMouse.y = -e.pageY + canvas.height
            mouse.moved = true
        }

        function handleMouseDown() {
            clicked = true
        }

        function handleMouseUp() {
            clicked = false
        }

        function handleResize() {
            canvas.width = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight
            canvas.height = window.innerWidth >= window.innerHeight ? window.innerWidth : window.innerHeight
            gl.viewport(0, 0, canvas.width, canvas.height)
            locationOfResolution = gl.getUniformLocation(program, "u_resolution")
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('resize', handleResize)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                padding: 0,
                margin: 0,
                overflow: 'hidden',
                display: 'flex',
                height: '100%',
                width: '100%',
                backgroundColor: '#000',
            }}
        />
    )
}

export default BlackHoleEffect