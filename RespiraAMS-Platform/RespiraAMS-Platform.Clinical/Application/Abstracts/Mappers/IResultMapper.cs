namespace Application.Abstracts.Mappers;

public interface IResultMapper<in TModel, out TResult>
{
    /*
     * This method is best used for in memory mapping. When using for SQL query, it may cause
     * an exception depend on how you use it.
     * - If the mapping is use on a top-level projection (essentially, the last call to Select()),
     * then the mapping can work
     * - If not, then the mapping will likely cause an exception to be thrown
     * For more information, refer: https://learn.microsoft.com/en-us/ef/core/querying/client-eval
     */
    
    /// <summary>
    /// Method to map from a model to a result (response) object.
    /// This method is safe when mapping in memory, for SQL mapping (Select()), use it with precaution
    /// </summary>
    TResult ToResult(TModel model);
}