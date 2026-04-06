namespace ApplicationService.Core.Application.AuthService.DTOs
{
    public class Response<T>
    {
        public bool Succeeded { get; set; }
        public T Data { get; set; }
        public string Message { get; set; }

        public Response(T data, string message = null)
        {
            Succeeded = true;
            Data = data;
            Message = message;
        }
    }
}
