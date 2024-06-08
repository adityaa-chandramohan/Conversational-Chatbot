

async function FetchData(question,name,phone) {
    try {
        const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        const hostname = window.location.hostname === 'localhost' ? 'localhost' : 'http:';
        
        const apiUrl = `${protocol}//${hostname}:5000`;


        const firstApiResponse = await fetch(`${apiUrl}/start`, {
            method: 'GET'
        
        });
        if (!firstApiResponse.ok) {
            throw new Error('Failed to fetch data from the first API');
        }

       const firstApiData = await firstApiResponse.json();
        const threadId = firstApiData.thread_id;

        // Second API call using data from the first API
        const secondApiResponse = await fetch(`${apiUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                thread_id: threadId,
                name: name,
                phone: phone,
                message: question
            })
        });

        if (!secondApiResponse.ok) {
            throw new Error('Failed to fetch data from the second API');
        }

        const secondApiData = await secondApiResponse.json();

        return secondApiData.response;
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
}

export default FetchData;
