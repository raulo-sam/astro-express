---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'My First Blog Post'
pubDate: 2022-07-01
description: 'This is the first post of my new Astro blog.'
author: 'Astro Learner'
image:
    url: 'https://astro.build/assets/blog/astro-1-release-update/cover.jpeg' 
    alt: 'The Astro logo with the word One.'
tags: ["astro", "blogging", "learning in public"]
---


[HOOKS](https://es.reactjs.org/docs/hooks-reference.html)
## useState
``` javascript
const [{counter1, counter2 }, setCounter] = useState({
	counter1: 10,
	counter2: 20   // estado inicial de las variables
})

```

## useCounter custom hook
hay que exponer en el return las propiedades o funciones 
 ```javascript
import { useState } from "react"


export const useCounter = ( initialValue = 10 ) => {

    const [ counter, setCounter ] = useState( initialValue )
    const increment = ( value = 1 ) => {
        setCounter( counter + value );
    }
    const decrement = ( value = 1 ) => {
        // if ( counter === 0 ) return;
        setCounter( counter - value );
    }
    const reset = () => {
        setCounter( initialValue );
    }

    return {
        counter,
        increment,
        decrement,
        reset,
    }

}

---
import { useCounter } from '../hooks/useCounter';
export const CounterWithCustomHook = () => {
    const { counter, increment, decrement, reset } = useCounter();
    return (
        <>
            <h1>Counter with Hook: { counter }</h1>
            <hr />
            <button onClick={ () => increment(2) } className="btn btn-primary">+1</button>
            <button onClick={ reset } className="btn btn-primary">Reset</button>
            <button onClick={ () => decrement(2) } className="btn btn-primary">-1</button>
        
        </>
    )
}
```



## useEffect 
``` javascript
    useEffect( () => {
        // console.log('useEffect called!');
        //solo se llama una vez al renderizar el componente
    }, []);
    
    useEffect( () => {
        // console.log('formState changed!');
        // se renedirza solo cuando formstate cambia
    }, [formState]);

    useEffect( () => {
        // console.log('email changed!');
        return () => {
            console.log('destroyed')
            // se dispara cuando el componente se destruye por completo
            // util para destruir subscripciones y listeners
        }
    }, []);
```


## useFetch
``` javascript
import { useEffect, useState } from "react";

export const useFetch = ( url ) => {

    const [state, setState] = useState({
        data: null,
        isLoading: true,
        hasError: null,
    })

    const getFetch = async () => {
        setState({
            ...state,
            isLoading: true,
        });

        const resp = await fetch(url);
        const data = await resp.json();

        setState({
            data,
            isLoading: false,
            hasError: null,
        });
    }

    useEffect(() => {
        getFetch();
    }, [url])
    
    return {
        data:      state.data,
        isLoading: state.isLoading,
        hasError:  state.hasError,
    };
}

```
## useRef 
Se usa para mantener la referencia a algun element o componente
Cuando la referencia cambia no dispara la renderizacion
``` javascript
import { useRef } from 'react';

export const FocusScreen = () => {
    const inputRef = useRef();
    const onClick = () => {
        // document.querySelector('input').select();
        // console.log(inputRef);
        inputRef.current.select();
    }
  return (
    <>
        <h1>Focus Screen</h1>
        <hr />

        <input 
            ref={ inputRef } // -> const inputRef = useRef();
            type="text" 
            placeholder="Ingrese su nombre"
            className="form-control"
        />

        <button 
            className="btn btn-primary mt-2"
            onClick={ onClick }
        >
            Set focus
        </button>
    </>
  )
}


```
## useLayoutEffect
Igual que useEffect pero se dispara despues de renderizar todos los elementos del DOM.
[useLayoutEffect](https://es.reactjs.org/docs/hooks-reference.html#uselayouteffect)

## Memo
Se usa para memorizar componentes , se recomienda cuando son muy grandes, o proceso pesado
El memo recibe como argumento el propio componente, solo se vuelve a renderizar cuando alguna cambian alguna de sus propiedades, no del padre


``` javascript
import React from 'react';
export const ShowIncrement = React.memo( ({ increment }) => {
    console.log(' Me volví a generar :( ');
    return (
        <button
            className="btn btn-primary"
            onClick={() => {
                increment( 5 );
            }}
        >
            Incrementar
        </button>
    )
})

```
## useCallback
Memorizan valores, parecido al useMemo, pero sirve para memorizar funciones, lo que regresa es una funcion que se puede ejectuar pero solo se vuelve a procesar cuando algo cambie
``` javascript

import { useCallback, useEffect, useState } from 'react';
import { ShowIncrement } from './ShowIncrement';


export const CallbackHook = () => {

  console.log('me volvi a dibujar')
    const [counter, setCounter] = useState( 10 );
    const incrementFather = useCallback(
      (value) => {
        setCounter( (c) => c + value );
      },
      [],
    );

    useEffect(() => {
      // incrementFather();
    }, [incrementFather])  
    
    // const incrementFather = () => {
    //     setCounter( counter + 1);
    // }

    return (
        <>
            <h1>useCallback Hook: { counter } </h1>
            <hr />

            <ShowIncrement increment={ incrementFather } />
        </>
    )
}

```
## useReducer
Es una alternativa al useState Doc [useReducer](https://es.reactjs.org/docs/hooks-reference.html#usereducer)
``` javascript
const [state, dispatch] = useReducer(reducer, initialArg, init);
	// dispatch = mandar acciones al reducer

```

## useContext
Similar a un servicio de Angular, comunicacion entre componentes no relacionados, Contenedor de informacion

El contexto es toda nuestra estructura de componentes de nuestra aplicacion.

``` javascript

import { createContext, useState } from "react";
import React from 'react'

// son High order component
export const useContext = createContext(); // ( ... ) estado inicial, valor que vamos 
// a exponer a todos los componentes que quieras tomar el contexto

// Usualmente la unica diferencia con componente tradicional tambien vamos a recibir
// children property estaran los hijos
// Para usarlo se coloca en el punto mas alto donde los hijos lo van a necesitar Main
export const UseProvider = ( { children } ) => {

	const [user, setUser ] = useState();

  return (
    <userontext.Provider value={{ Hola: 'Mundo' }}>
        Provider provee un valor a los children con value=""
        { children } 
        {/* todos los hijos se renderizan */}
    </useContext.Provider>
  )
}

```

Se envuelve con el UseProvider todos los elementos que queramos que reciban la data en el value

``` javascript
  return (
    <UseProvider>
    
        <NavBar />
        <Routes>
          <Route path="/" element={ <HomePage/> } />

          {/* <Route path="/*" element={ <> <h1> Error </h1></> } /> */}
          <Route path="/*" element={ <Navigate to="error"/> } />

          <Route path="login" element={ <LoginPage/> } />
          <Route path="about" element={ <AboutPage/> } />
          <Route path="error" element={ <ErrorPage/> } />

        </Routes>


    </UseProvider>
  )

```

Para usar el contexto en los hijos se llama al useContext , si tuvieramos varios userContext se recibe el mas cercano hacia arriba.
El contexto provee la funcion setUser y la usamos en el componente, se establece globalmente en el contexto.
``` javascript
import React, {useContext} from 'react'
import { userContext } from './Context/UserContext'

export const LoginPage = () => {

  const {user, setUser} = useContext( userContext )
  return (
    <>
        <div>LoginPage</div>
		<pre>
          { JSON.stringify(user)}
        </pre>
        
        <button
        onClick={ ()=> setuser({name: 'Raul', edad: 34})}>
         set User
         </button>
        
    </>
  )
}

```

## useParams
obtiene la url y el segmento tipo /hero/id

Published on: 2022-07-01

Welcome to my _new blog_ about learning Astro! Here, I will share my learning journey as I build a new website.

## What I've accomplished

1. **Installing Astro**: First, I created a new Astro project and set up my online accounts.

2. **Making Pages**: I then learned how to make pages by creating new `.astro` files and placing them in the `src/pages/` folder.

3. **Making Blog Posts**: This is my first blog post! I now have Astro pages and Markdown posts!

## What's next

I will finish the Astro tutorial, and then keep adding more posts. Watch this space for more to come. -->
