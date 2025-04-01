namespace Repository.Domain.Entities
{
    public class RepositorySelection
    {
        public int Id { get; set; }
        public string Provider { get; set; }
        public string Project { get; set; }
        public string Repository { get; set; }
        public string Branch { get; set; }
    }
}
