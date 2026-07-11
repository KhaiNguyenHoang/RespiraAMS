namespace Application.Abstracts.Mappers;

public interface IUpdateMapper<in TModel, in TUpdateCommand>
{
    void MapModel(TModel model, TUpdateCommand command);
}