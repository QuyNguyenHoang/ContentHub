namespace ContentHub.Application.Models
{
    public class ApiResponse<T> 
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }
}
