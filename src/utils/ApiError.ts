export const ApiError = (message: string, status: number = 400, error?:any) => {
  return Response.json(
    {
      success: false,
      message,
      error
    },
    { status }
  );
};
 