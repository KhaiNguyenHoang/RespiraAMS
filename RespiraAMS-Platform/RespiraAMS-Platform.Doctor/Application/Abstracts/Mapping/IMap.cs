namespace Application.Abstracts.Mapping
{
    public interface IMap<in In, out Out>
    {
        Out Map(In source);
    }
}
