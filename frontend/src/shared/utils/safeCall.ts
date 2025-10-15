export type SafeResult<T, E = Error> = 
    | { success: true; data: T; error: null }
    | { success: false; data: null; error: E };

export async function safeCall<T>(
    promise: Promise<T>
    ): Promise<SafeResult<T>> {
    try {
        const data = await promise;
        console.log('safeCall data:', data);
        return { success: true, data, error: null };
    } catch (err: any) {
        console.log('❌ safeCall error atrapado:', err);

        // Caso especial: error de Axios con respuesta del backend
        if (err.isAxiosError && err.response) {
            const backendData = err.response.data;
            const message =
                backendData?.message ||
                backendData?.error ||
                `Error HTTP ${err.response.status}`;
            const customError = new Error(message);
            return { success: false, data: null, error: customError };
        }

        // Cualquier otro error
        const error = err instanceof Error ? err : new Error(String(err));
        return { success: false, data: null, error };
    }
}