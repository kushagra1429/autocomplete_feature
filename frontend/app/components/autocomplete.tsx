"use client"
import Image from "next/image";
import styles from "./AutoComplete.module.css"
import { useEffect, useState } from "react";


interface Recipes{
  id: number;
  lat: string;
  lon:string;
  name: string;
};

export default function AutoComplete(){
    const [inputText, setInputText]=useState("")
    const [results, setResults] = useState<Recipes[]>([]);

    // API Call
    const fetchData = async ()=>{
        const res= await fetch(`/api/autocomplete?q=${inputText}`);
        const data=await res.json()
        console.log(data,'print')
        setResults(data)
    }
    
    useEffect(()=>{
        console.log(results, "results")
    }, [results])

    useEffect(()=>{
        if (!inputText.trim()) {
            setResults([]);
            return;
        }
        const timer = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timer);
    },[inputText])

    return (
        <>
        <div className={styles.mainContainer}>
            <div className={styles.heading}>Address AutoCompletion</div>
            <div className={styles.inputcontainer}>
                <input type="text" placeholder="Address" value={inputText} onChange={(e)=>{setInputText(e.target.value)}}/>
                {results.length > 0 && (
                <div className={`${styles.AutoComplete_container} ${styles.activeRecommendations}`}>
                    {results.map((item) => (<>
                    <div className={styles.subclass}>
                        <span className={styles.searchBtn}>&#128269;</span>
                    <span
                        key={item.id}
                        className={styles.AutoComplete_vals}
                        onClick={() => {
                        setInputText(item.name);
                        setResults([]);
                        }}
                    >
                        {item.name}
                    </span>
                    </div>
                    </>
                    
                    ))}
                </div>
                )}
            </div>
        </div>
        </>
    )
}