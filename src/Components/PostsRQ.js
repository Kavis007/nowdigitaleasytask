import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
const PostsRQ = () => {

    // const { data } = useQuery({
    //     queryKey: ["products"],
    //     queryFn: () => {
    //         return axios.get('http://localhost:3000/products')
    //     }
    // })
     const{data}=useQuery({
        queryKey:["posts"],
        queryFn:()=>{
            return axios.get('http://localhost:3000/products')
        }
    })
    return (
        <div>
            {data?.data.map((post) => (
                <div key={post.id}>
                    <h3>{post.desc}</h3>
                    <p>{post.spec}</p>
                </div>
            ))}
        </div>
    )
}

export default PostsRQ
