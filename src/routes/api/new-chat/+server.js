export async function post(request) {
    const body = await request.json();

    if (!body.chatTitle) {
        return {
            status: 400,
            body: {
                message: 'Missing chat title'
            }
        };
    }

    return {
        status: 200,
        body: {
            message: 'New chat created successfully',
            chatTitle: body.chatTitle
        }
    };
}
