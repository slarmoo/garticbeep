import { useState, useEffect, /*useMemo, createElement, Fragment, type ReactElement*/ } from "react";
import { HTML } from "imperative-html";
import "./chainTable.css"
const { table, thead, tbody, tr, th, a, div } = HTML;

export function ViewChains() {
    const [chains, setChains] = useState<chain[]>([]);
    const [chainTable, setChainTable] = useState<HTMLTableElement>();
    const [view, setView] = useState<number>(viewOptions.chain);

    useEffect(() => {
        fetch("/api/getAll", {
            method: 'get',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(result => result.json())
        .then(response => {
            setChains(response.chains as chain[]);
        })
    }, [])  

    useEffect(() => {
        switch (view) {
            case viewOptions.chain: {
                const row: HTMLTableRowElement = tr();
                const head: HTMLTableSectionElement = thead(row);
                for (let i: number = 1; i <= 5; i++) {
                    row.appendChild(th("Round " + i + " prompt"));
                    row.appendChild(th("Round " + i + " prompt giver"));
                    row.appendChild(th("Round " + i + " song"));
                    row.appendChild(th("Round " + i + " song maker"));
                }
                const body: HTMLTableSectionElement = tbody();
                for (let chainIndex: number = 0; chainIndex < chains.length; chainIndex++) {
                    const row: HTMLTableRowElement = tr();
                    for (let i: number = 1; i <= 5; i++) {
                        const chainLink: chainLink = chains[chainIndex].chain[i-1]
                        row.appendChild(th(chainLink?.prompt || "null"));
                        row.appendChild(th(chainLink?.promptGiver || "null"));
                        row.appendChild(th(a({ href: chainLink?.song || "null", target: "_blank" }, chainLink?.songName || "null")));
                        row.appendChild(th(chainLink?.songmaker || "null"));
                    }
                    body.appendChild(row);
                }
                setChainTable(table(head, body));
                break;
            }
            case viewOptions.username: {
                const row: HTMLTableRowElement = tr();
                const head: HTMLTableSectionElement = thead(row);
                row.appendChild(th("username"))
                for (let i: number = 1; i <= 5; i++) {
                    row.appendChild(th("Round " + i + " prompt"));
                    row.appendChild(th("Round " + i + " song"));
                }
                const body: HTMLTableSectionElement = tbody();
                const rows: Map<string, HTMLTableRowElement> = new Map();
                //reate rows
                for (let userIndex: number = 0; userIndex < chains.length; userIndex++) {
                    const promptGiver = chains[userIndex].chain[0].promptGiver;
                    const row: HTMLTableRowElement = tr(th(promptGiver));
                    rows.set(promptGiver, row);
                }
                //add to rows
                for (let roundIndex: number = 1; roundIndex <= 5; roundIndex++) {
                    for (let chainIndex: number = 0; chainIndex < chains.length; chainIndex++) {
                        const chainLink: chainLink = chains[chainIndex].chain[roundIndex-1];
                        const row1 = rows.get(chainLink?.promptGiver || "null");
                        row1?.appendChild(th(chainLink?.prompt || "null"))
                    }
                    for (let chainIndex: number = 0; chainIndex < chains.length; chainIndex++) {
                        const chainLink: chainLink = chains[chainIndex].chain[roundIndex-1];
                        if (chainLink?.songmaker) {
                            const row2 = rows.get(chainLink?.songmaker);
                            row2?.appendChild(th(a({ href: chainLink?.song || "null", target: "_blank" }, chainLink?.songName || "null")))
                        }
                    }
                }
                //add rows to body
                for (let userIndex: number = 0; userIndex < chains.length; userIndex++) {
                    const promptGiver = chains[userIndex].chain[0].promptGiver;
                    body.appendChild(rows.get(promptGiver)!);
                }
                setChainTable(table(head, body));
                break;
            }
        }
    }, [chains, view])

    useEffect(() => {
        const tableWrapper = document.getElementById("tableWrapper");
        if (tableWrapper) {
            tableWrapper.innerHTML = div(chainTable).innerHTML;
        }
    }, [chainTable])

    return (
        <div>
            <select id="tableView" onChange={(event) => {
                setView(viewOptions[event.target.value]);
            }} defaultValue={viewOptions.chain}>
                <option>chain</option>
                <option>username</option>
            </select>
            <div id="tableWrapper"></div>
        </div>
    )
}

const viewOptions: { [key: string]: number } = {
    chain: 0,
    username: 1,
} as const

export interface chain {
    chain: chainLink[],
    _id?: number
}

export interface chainLink {
    promptGiver: string,
    prompt?: string,
    songmaker?: string,
    song?: string,
    songName?: string
}
