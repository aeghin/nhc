'use client'

import { useQuery } from "@tanstack/react-query"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";


export default function Dashboard() {

    const getPokemonInfo = async () => {
        const url = 'https://66e740d117055714e58bd904.mockapi.io/api/v1/users';
        const response = await fetch(url);
        // console.log(response);
        return response.json();
    };

    const { data: users } = useQuery({ queryKey: ['pokemonData'], queryFn: getPokemonInfo })
    console.log(users);


    return (
        <div>{users?.map((user: any) => (
            <h1 className="flex justify-center" key={user.id}>{user.name}</h1>
        ))}</div>
    )
};