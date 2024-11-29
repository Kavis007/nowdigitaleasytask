import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Postinnormal = () => {
    const [data, setData] = useState([]);

    const fetchpost = async () => {
        try {
            const resp = await axios.get('http://localhost:3000/products');
            setData(resp.data);
        }
        catch (e) {
            console.log("it is an error");
        }
    }

    useEffect(() => {
        fetchpost();
    }, [])
    return (
        <div>
            {data.map((post) => (
                <div key={post.id}>
                    <h3>{post.desc}</h3>
                    <p>{post.spec}</p>
                </div>
            ))}
        </div>

    )
}

export default Postinnormal
