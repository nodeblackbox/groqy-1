"use client"
import React, { useRef, useEffect } from 'react';

const DataFlowVisualization = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const docSources = ['shadcn', 'Wikipedia', 'React Docs', 'Research Papers', 'API Docs', 'Stack Overflow'];

        class DocumentCube {
            constructor(source, x, y) {
                this.source = source;
                this.x = x;
                this.y = y;
                this.size = 0;
                this.maxSize = 30;
                this.growing = true;
                this.alpha = 1;
            }

            update() {
                if (this.growing)
                {
                    this.size += 1.5;
                    if (this.size >= this.maxSize)
                    {
                        this.growing = false;
                    }
                } else
                {
                    this.size -= 0.75;
                    this.alpha -= 0.02;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 4);
                ctx.fillStyle = `rgba(100, 200, 255, ${this.alpha})`;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();

                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.font = '8px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(this.source, this.x, this.y + this.maxSize / 2 + 12);
            }
        }

        class Particle {
            constructor(x, y, path) {
                this.x = x;
                this.y = y;
                this.size = 2;
                this.char = Math.random() < 0.9 ? '1' : '0';
                this.path = path;
                this.progress = 0;
                this.speed = Math.random() * 0.5 + 0.5;
                this.alpha = 1;
            }

            update() {
                this.progress += this.speed;
                if (this.progress >= 100)
                {
                    this.alpha -= 0.05;
                }
                const t = this.progress / 100;
                const cp = this.path.controlPoints;
                this.x = Math.pow(1 - t, 3) * cp[0].x + 3 * Math.pow(1 - t, 2) * t * cp[1].x + 3 * (1 - t) * Math.pow(t, 2) * cp[2].x + Math.pow(t, 3) * cp[3].x;
                this.y = Math.pow(1 - t, 3) * cp[0].y + 3 * Math.pow(1 - t, 2) * t * cp[1].y + 3 * (1 - t) * Math.pow(t, 2) * cp[2].y + Math.pow(t, 3) * cp[3].y;
            }

            draw() {
                ctx.fillStyle = `rgba(0, 255, 0, ${this.alpha})`;
                ctx.font = '8px monospace';
                ctx.fillText(this.char, this.x, this.y);
            }
        }

        const cubes = [];
        const particles = [];
        const paths = [
            {
                controlPoints: [
                    { x: canvas.width * 0.2, y: canvas.height * 0.35 },
                    { x: canvas.width * 0.3, y: canvas.height * 0.3 },
                    { x: canvas.width * 0.35, y: canvas.height * 0.4 },
                    { x: canvas.width * 0.4, y: canvas.height * 0.42 }
                ]
            },
            {
                controlPoints: [
                    { x: canvas.width * 0.2, y: canvas.height * 0.65 },
                    { x: canvas.width * 0.3, y: canvas.height * 0.7 },
                    { x: canvas.width * 0.35, y: canvas.height * 0.6 },
                    { x: canvas.width * 0.4, y: canvas.height * 0.58 }
                ]
            },
            {
                controlPoints: [
                    { x: canvas.width * 0.6, y: canvas.height * 0.42 },
                    { x: canvas.width * 0.65, y: canvas.height * 0.4 },
                    { x: canvas.width * 0.7, y: canvas.height * 0.3 },
                    { x: canvas.width * 0.8, y: canvas.height * 0.35 }
                ]
            },
            {
                controlPoints: [
                    { x: canvas.width * 0.6, y: canvas.height * 0.58 },
                    { x: canvas.width * 0.65, y: canvas.height * 0.6 },
                    { x: canvas.width * 0.7, y: canvas.height * 0.7 },
                    { x: canvas.width * 0.8, y: canvas.height * 0.65 }
                ]
            }
        ];

        function createCube() {
            const source = docSources[Math.floor(Math.random() * docSources.length)];
            const side = Math.random() < 0.5 ? 'left' : 'right';
            const x = side === 'left' ? canvas.width * 0.2 : canvas.width * 0.8;
            const y = Math.random() < 0.5 ? canvas.height * 0.35 : canvas.height * 0.65;
            cubes.push(new DocumentCube(source, x, y));
        }

        function createParticle() {
            const pathIndex = Math.floor(Math.random() * paths.length);
            const path = paths[pathIndex];
            const startPoint = path.controlPoints[0];
            particles.push(new Particle(startPoint.x, startPoint.y, path));
        }

        function drawBox(x, y, width, height, text) {
            ctx.fillStyle = 'rgba(50, 150, 255, 0.8)';
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(text, x + width / 2, y + height / 2 + 4);
        }

        function drawAgentChef() {

            ctx.beginPath();
            ctx.fill();
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('👨‍🍳', canvas.width * 0.5, canvas.height * 0.5 + 10);

            ctx.font = '10px Arial';
        }

        function drawDatabase() {
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.92, canvas.height * 0.4);
            ctx.lineTo(canvas.width * 0.96, canvas.height * 0.4);
            ctx.lineTo(canvas.width * 0.96, canvas.height * 0.6);
            ctx.lineTo(canvas.width * 0.92, canvas.height * 0.6);
            ctx.closePath();
            ctx.stroke();

            for (let i = 0; i < 5; i++)
            {
                ctx.beginPath();
                ctx.moveTo(canvas.width * 0.92, canvas.height * (0.44 + i * 0.04));
                ctx.lineTo(canvas.width * 0.96, canvas.height * (0.44 + i * 0.04));
                ctx.stroke();
            }

            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Database', canvas.width * 0.94, canvas.height * 0.38);
        }

        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.02) createCube();
            if (Math.random() < 0.2) createParticle();

            cubes.forEach((cube, index) => {
                cube.update();
                cube.draw();
                if (cube.alpha <= 0) cubes.splice(index, 1);
            });

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();
                if (particle.alpha <= 0) particles.splice(index, 1);
            });

            // Left side boxes
            drawBox(canvas.width * 0.4, canvas.height * 0.42, 50, 25, 'Input');
            drawBox(canvas.width * 0.4, canvas.height * 0.58, 50, 25, 'Output');

            // Right side boxes
            drawBox(canvas.width * 0.6, canvas.height * 0.42, 50, 25, 'Input');
            drawBox(canvas.width * 0.6, canvas.height * 0.58, 50, 25, 'Output');

            drawAgentChef();
            drawDatabase();

            requestAnimationFrame(animate);
        }

        animate();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Recalculate path control points on resize
            paths[0].controlPoints = [
                { x: canvas.width * 0.2, y: canvas.height * 0.35 },
                { x: canvas.width * 0.3, y: canvas.height * 0.3 },
                { x: canvas.width * 0.35, y: canvas.height * 0.4 },
                { x: canvas.width * 0.4, y: canvas.height * 0.42 }
            ];
            paths[1].controlPoints = [
                { x: canvas.width * 0.2, y: canvas.height * 0.65 },
                { x: canvas.width * 0.3, y: canvas.height * 0.7 },
                { x: canvas.width * 0.35, y: canvas.height * 0.6 },
                { x: canvas.width * 0.4, y: canvas.height * 0.58 }
            ];
            paths[2].controlPoints = [
                { x: canvas.width * 0.6, y: canvas.height * 0.42 },
                { x: canvas.width * 0.65, y: canvas.height * 0.4 },
                { x: canvas.width * 0.7, y: canvas.height * 0.3 },
                { x: canvas.width * 0.8, y: canvas.height * 0.35 }
            ];
            paths[3].controlPoints = [
                { x: canvas.width * 0.6, y: canvas.height * 0.58 },
                { x: canvas.width * 0.65, y: canvas.height * 0.6 },
                { x: canvas.width * 0.7, y: canvas.height * 0.7 },
                { x: canvas.width * 0.8, y: canvas.height * 0.65 }
            ];
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'black'
            }}
        />
    );
};

export default DataFlowVisualization;