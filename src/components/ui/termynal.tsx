import React, { useEffect, useRef } from "react";

interface TermynalOptions {
    prefix?: string;
    startDelay?: number;
    typeDelay?: number;
    lineDelay?: number;
    progressLength?: number;
    progressChar?: string;
    progressPercent?: number;
    cursor?: string;
    lineData?: LineData[];
    noInit?: boolean;
}

interface LineData {
    type?: string;
    value?: string;
    class?: string;
    [key: string]: any;
}

class Termynal {
    container: HTMLElement;
    pfx: string;
    startDelay: number;
    originalStartDelay: number;
    typeDelay: number;
    originalTypeDelay: number;
    lineDelay: number;
    originalLineDelay: number;
    progressLength: number;
    progressChar: string;
    progressPercent: number;
    cursor: string;
    lineData: Element[];
    lines: Element[] = [];
    finishElement!: HTMLElement;

    constructor(container: HTMLElement, options: TermynalOptions = {}) {
        this.container = container;
        this.container.style.textAlign = "left";
        this.pfx = `data-${options.prefix || "ty"}`;
        this.originalStartDelay = this.startDelay =
            options.startDelay ||
            parseFloat(this.container.getAttribute(`${this.pfx}-startDelay`) || "0") ||
            600;
        this.originalTypeDelay = this.typeDelay =
            options.typeDelay ||
            parseFloat(this.container.getAttribute(`${this.pfx}-typeDelay`) || "0") ||
            90;
        this.originalLineDelay = this.lineDelay =
            options.lineDelay ||
            parseFloat(this.container.getAttribute(`${this.pfx}-lineDelay`) || "0") ||
            1500;
        this.progressLength =
            options.progressLength ||
            parseFloat(this.container.getAttribute(`${this.pfx}-progressLength`) || "0") ||
            40;
        this.progressChar =
            options.progressChar ||
            this.container.getAttribute(`${this.pfx}-progressChar`) ||
            "█";
        this.progressPercent =
            options.progressPercent ||
            parseFloat(this.container.getAttribute(`${this.pfx}-progressPercent`) || "0") ||
            100;
        this.cursor =
            options.cursor ||
            this.container.getAttribute(`${this.pfx}-cursor`) ||
            "▋";
        this.lineData = this.lineDataToElements(options.lineData || []);
        this.loadLines();
        if (!options.noInit) this.init();
    }

    loadLines() {
        const finish = this.generateFinish();
        finish.style.visibility = "hidden";
        this.container.appendChild(finish);

        // Only use lineData, not elements already in the container
        this.lines = [...this.lineData];
        for (let line of this.lines) {
            (line as HTMLElement).style.visibility = "hidden";
        }

        const restart = this.generateRestart();
        restart.style.visibility = "hidden";
        this.container.appendChild(restart);

        this.container.setAttribute("data-termynal", "");
    }

    init() {
        const containerStyle = getComputedStyle(this.container);
        this.container.style.width = containerStyle.width !== "0px" ? containerStyle.width : "";
        this.container.style.minHeight = containerStyle.height !== "0px" ? containerStyle.height : "";

        this.container.setAttribute("data-termynal", "");
        this.container.innerHTML = "";
        for (let line of this.lines) {
            (line as HTMLElement).style.visibility = "visible";
        }
        this.start();
    }

    async start() {
        this.addFinish();
        await this._wait(this.startDelay);

        for (let line of this.lines) {
            const type = line.getAttribute(this.pfx);
            const delay = parseFloat(line.getAttribute(`${this.pfx}-delay`) || "") || this.lineDelay;

            if (type === "input") {
                line.setAttribute(`${this.pfx}-cursor`, this.cursor);
                await this.type(line as HTMLElement);
                await this._wait(delay);
            } else if (type === "progress") {
                await this.progress(line as HTMLElement);
                await this._wait(delay);
            } else if (type === "stats") {
                await this.stats(line as HTMLElement, "AppSolves");
                await this._wait(delay);
            } else {
                this.container.appendChild(line);
                await this._wait(delay);
            }

            line.removeAttribute(`${this.pfx}-cursor`);
        }
        this.addRestart();
        this.finishElement.style.visibility = "hidden";
        this.lineDelay = this.originalLineDelay;
        this.typeDelay = this.originalTypeDelay;
        this.startDelay = this.originalStartDelay;
    }

    generateRestart(): HTMLElement {
        const restart = document.createElement("a");
        restart.onclick = (e) => {
            e.preventDefault();
            this.container.innerHTML = "";
            this.init();
        };
        restart.href = "#";
        restart.setAttribute("data-terminal-control", "");
        restart.innerHTML = "restart ↻";
        return restart;
    }

    generateFinish(): HTMLElement {
        const finish = document.createElement("a");
        finish.onclick = (e) => {
            e.preventDefault();
            this.lineDelay = 0;
            this.typeDelay = 0;
            this.startDelay = 0;
        };
        finish.href = "#";
        finish.setAttribute("data-terminal-control", "");
        finish.innerHTML = "fast →";
        this.finishElement = finish;
        return finish;
    }

    addRestart() {
        const restart = this.generateRestart();
        this.container.appendChild(restart);
    }

    addFinish() {
        const finish = this.generateFinish();
        this.container.appendChild(finish);
    }

    async type(line: HTMLElement) {
        const chars = [...line.textContent || ""];
        line.textContent = "";
        this.container.appendChild(line);

        for (let char of chars) {
            const delay = parseFloat(line.getAttribute(`${this.pfx}-typeDelay`) || "") || this.typeDelay;
            await this._wait(delay);
            line.textContent += char;
        }
    }

    async progress(line: HTMLElement) {
        const progressLength =
            parseFloat(line.getAttribute(`${this.pfx}-progressLength`) || "") || this.progressLength;
        const progressChar = line.getAttribute(`${this.pfx}-progressChar`) || this.progressChar;
        const chars = progressChar.repeat(progressLength);
        const progressPercent =
            parseFloat(line.getAttribute(`${this.pfx}-progressPercent`) || "") || this.progressPercent;

        line.innerHTML = ""; // instead of textContent
        this.container.appendChild(line);

        const barSpan = document.createElement("span");
        barSpan.style.whiteSpace = "pre-wrap"; // allow wrapping
        barSpan.style.wordBreak = "break-all"; // force wrap on overflow
        line.appendChild(barSpan);

        const percentSpan = document.createElement("span");
        percentSpan.style.marginLeft = "8px";
        line.appendChild(percentSpan);

        for (let i = 1; i < chars.length + 1; i++) {
            await this._wait(this.typeDelay);
            const percent = Math.round((i / chars.length) * 100);

            barSpan.textContent = chars.slice(0, i);
            percentSpan.textContent = `${percent}%`;

            if (percent > progressPercent) break;
        }
    }

    async stats(line: HTMLElement, username: string) {
        const link = document.createElement("a");
        link.href = `https://github.com/AppSolves#-github-stats`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const img = document.createElement("img");
        img.src = `https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight`;
        img.alt = "GitHub Stats";
        img.style.width = "100%";
        img.style.maxWidth = "650px";
        img.style.marginTop = "16px";

        img.style.opacity = "0";
        img.style.transform = "scale(0.5)";
        img.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        line.innerHTML = "";
        link.appendChild(img);
        line.appendChild(link);

        this.container.appendChild(line);
        await new Promise((resolve) => {
            img.onload = () => resolve(true);
        });

        await this._wait(300);
        img.style.opacity = "1";
        img.style.transform = "scale(1)";

        await this._wait(300);
    }

    _wait(time: number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    lineDataToElements(lineData: LineData[]): Element[] {
        return lineData.map((line) => {
            const div = document.createElement("div");
            div.innerHTML = `<span ${this._attributes(line)}>${line.value || ""}</span>`;
            return div.firstElementChild as HTMLElement;
        });
    }

    _attributes(line: LineData): string {
        let attrs = "";
        for (let prop in line) {
            if (prop === "class") {
                attrs += ` class=${line[prop]} `;
                continue;
            }
            if (prop === "type") {
                attrs += `${this.pfx}="${line[prop]}" `;
            } else if (prop !== "value") {
                attrs += `${this.pfx}-${prop}="${line[prop]}" `;
            }
        }
        return attrs;
    }
}

// React wrapper
const TermynalComponent: React.FC<{ options?: TermynalOptions }> = ({ options }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<ShadowRoot | null>(null);
    const styleLinks = [
        "https://raw.githubusercontent.com/tiangolo/tiangolo.com/refs/heads/master/docs/css/termynal.css",
        "https://raw.githubusercontent.com/tiangolo/tiangolo.com/refs/heads/master/docs/css/custom.css",
    ];

    async function loadCSS() {
        if (!shadowRef.current) return;

        for (const link of styleLinks) {
            try {
                const res = await fetch(link);
                const cssText = await res.text();
                const style = document.createElement("style");
                style.textContent = cssText;
                shadowRef.current.appendChild(style);
            } catch (err) {
                console.error("Fehler beim Laden der CSS:", err);
            }
        }
    }

    useEffect(() => {
        if (!containerRef.current) return;

        if (!shadowRef.current) {
            shadowRef.current = containerRef.current.attachShadow({ mode: "open" });
            loadCSS();

            const div = document.createElement("div");
            shadowRef.current.appendChild(div);

            new Termynal(div, options);
        }
    }, [options]);

    return (
        <div className="items-center justify-center" ref={containerRef} />
    );
};

export default TermynalComponent;
