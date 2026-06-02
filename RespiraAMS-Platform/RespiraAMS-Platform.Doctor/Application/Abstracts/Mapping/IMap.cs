namespace Application.Abstracts.Mapping
{
    public interface IMap<In, Out>
    {
        Out Map(In source);
    }
}
