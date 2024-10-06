// Use ES module syntax
export const handler = async (event) => {
    const keyword = event.queryStringParameters?.keyword || 'default keyword';
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: `Sai Shanker says ${keyword}`,
        }),
    };
    return response;
};
