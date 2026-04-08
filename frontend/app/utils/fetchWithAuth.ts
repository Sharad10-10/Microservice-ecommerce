

const fetchWithAuth = async(url:string, options: RequestInit={}): Promise<Response | null>=> {

    let response = await fetch(url, {
        ...options,
        credentials: 'include'
    })

    if(response.status === 401 ) {
        const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/api/auth-service/refresh`, {
            method: 'POST',
            credentials: 'include'
        })


        if(refreshResponse?.ok) {
            response = await fetch(url, {
                ...options,
                credentials: 'include'
            })
        }
        else {

            // return {error: 'Not authorized'}
            return null
        }
      
    }

    return response


}


export default fetchWithAuth