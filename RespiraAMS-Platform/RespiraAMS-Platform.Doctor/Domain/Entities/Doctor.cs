using Domain.Enums;
using RespiraAMS_Platform.Shared.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Domain.Entities
{
    public class Doctor : BaseEntity
    {
        public required string Address { get; set; }
        public required ICollection<DegreeEnum> Degrees { get; set; }
        public AcademicTitleEnum? AcademicTitle { get; set; }
        public required string CitizenIdentificationCard { get; set; }
        public bool Gender { get; set; } // true = female, false = male
        public Date? DateOfBirtDate { get; set; }
        public required PositionEnum Position { get; set; }
    }
}
