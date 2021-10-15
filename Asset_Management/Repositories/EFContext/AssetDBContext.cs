using System;
using Asset_Management.Repositories.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;

namespace Asset_Management.Repositories.EFContext
{
  public class AssetDBContext : IdentityDbContext<AppUser, AppRole, int>
  {
    public AssetDBContext(DbContextOptions options) : base(options) { }
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<AppRole> AppRoles { get; set; }
    public DbSet<AssignmentEntity> AssignmentEntity { get; set; }
    public DbSet<AssetsEntity> AssetsEntity { get; set; }
    public DbSet<CategoriesEntity> CategoriesEntity { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<IdentityUserClaim<int>>().ToTable("AppUserClaims");
      modelBuilder.Entity<IdentityUserRole<int>>().ToTable("AppUserRoles").HasKey(x => new { x.UserId, x.RoleId });
      modelBuilder.Entity<IdentityUserLogin<int>>().ToTable("AppUserLogins").HasKey(x => x.UserId);

      modelBuilder.Entity<IdentityRoleClaim<int>>().ToTable("AppRoleClaims");
      modelBuilder.Entity<IdentityUserToken<int>>().ToTable("AppUserTokens").HasKey(x => x.UserId);

      foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
      {
        relationship.DeleteBehavior = DeleteBehavior.Restrict;
      }
      modelBuilder.Entity<AssignmentEntity>().HasMany(c => c.AssignUsers);
      modelBuilder.Entity<AssignmentEntity>().HasOne(c => c.Asset);
      modelBuilder.Entity<AssetsEntity>().HasMany(c => c.AssignmentList);
      modelBuilder.Entity<AppUser>().HasMany(c => c.AssignmentList);
      modelBuilder.Entity<AppUser>().Property(c => c.IsFirstLogin).HasDefaultValue(true);
      modelBuilder.Entity<AppUser>().Property(c => c.UserName).HasComputedColumnSql("REPLACE( ( ( LOWER ([FirstName]) ) +( LOWER ( [LastNameFirstChar] )  ) ) ,' ','') +CAST( [CountDuplicate] as varchar(200) )");
      modelBuilder.Entity<AppUser>().Property(c => c.NormalizedUserName).HasComputedColumnSql("UPPER([FirstName])+UPPER([LastNameFirstChar])+CAST( [CountDuplicate] as varchar(200) )");
      modelBuilder.Entity<AppUser>().Property(c => c.Code).HasComputedColumnSql("'SD'+CAST((RIGHT('0000'+CONVERT(varchar(20),[Id]),4)) as varchar(200))");
      modelBuilder.Entity<AssetsEntity>().Property(c => c.AssetCode).HasComputedColumnSql("[Prefix]+CAST((RIGHT('00000'+CONVERT(varchar(20),[CountPrefix]),5)) as varchar(200))");
      modelBuilder.Entity<CategoriesEntity>().HasData(new CategoriesEntity
      {
        CategoryId = 1,
        CategoryName = "GamingLaptop",
        CategoryPrefix = "GA"
      },
      new CategoriesEntity
      {
        CategoryId = 2,
        CategoryName = "HondaMotor",
        CategoryPrefix = "HO"
      }
      );
      modelBuilder.Entity<AssetsEntity>().HasData(
          new AssetsEntity
          {
            AssetId = 1,
            AssetCode = "GA00001",
            AssetName = "Dell Alienware",
            CategoryId = 1,
            Prefix = "GA",
            InstalledDate = DateTime.Now,
            State = (State)1,
            Location = "HaNoiCity",
            CountPrefix = 1
          },
            new AssetsEntity
            {
              AssetId = 2,
              AssetCode = "HO00001",
              AssetName = "HondaCB150R",
              CategoryId = 2,
              Prefix = "HO",
              InstalledDate = DateTime.Now,
              State = (State)1,
              Location = "HoChiMinhCity",
              CountPrefix = 1
            }
      );
      modelBuilder.Entity<AppRole>().HasData(
      new AppRole
      {
        Id = 1,
        Name = "Admin",
        NormalizedName = "ADMIN",
        ConcurrencyStamp = "31BF5413-8303-4E21-8D3A-10099FCA95FE",
        Description = "administrator",
      }, new AppRole
      {
        Id = 2,
        Name = "User",
        NormalizedName = "USER",
        ConcurrencyStamp = "94BD65EE-DE64-4476-91AA-6258155DE018",
        Description = "For Staff",
      });
      modelBuilder.Entity<AppUser>().HasData(new AppUser
      {
        Id = 1,
        Code = "SD0001",
        Location = "HaNoiCity",
        FirstName = "Nghia",
        LastName = "Le Trung",
        Dob = new DateTime(2000, 02, 02),
        JoinDate = DateTime.Now,
        Gender = "Male",
        Type = (Role)0,
        LastNameFirstChar = "LT",
        CountDuplicate = "",
        UserName = "nghialt",
        NormalizedUserName = "NGHIALT",
        IsDisabled = true,
        PasswordHash = "AQAAAAEAACcQAAAAEBq/+hPonu3IIEDQw94Cins2vgQcOYU4S+EOGT9HiCg1BF/HV1EBcfbb34AIP0xS5Q==",
        SecurityStamp = "VR77OGQ2ABQ5VRWTTDEMHBLJEKS57OYD",
        ConcurrencyStamp = "f99461ee-4644-4148-8874-b4ab37562be3",
      },
      new AppUser
      {
        Id = 2,
        Code = "SD0002",
        Location = "HoChiMinhCity",
        FirstName = "Dai",
        LastName = "Pham Ngoc",
        Dob = new DateTime(2000, 02, 02),
        JoinDate = DateTime.Now,
        Gender = "Male",
        Type = (Role)0,
        LastNameFirstChar = "PN",
        CountDuplicate = "",
        UserName = "daipn",
        NormalizedUserName = "DAIPN",
        IsDisabled = true,
        PasswordHash = "AQAAAAEAACcQAAAAEHePd1dt5Al4lcPaoeC0papVqdjFjFcS+WIkyVtyWMLZQ7dYkqQkqmv0GRqe8hynSA==",
        SecurityStamp = "C744PF3YR7EXC4OHEJT4D6AXWXINDPKZ",
        ConcurrencyStamp = "1bd28b36-6112-42cb-a642-6a6df7f6b311",
      },
      new AppUser
      {
        Id = 3,
        Code = "SD0003",
        Location = "DaNangCity",
        FirstName = "Thang",
        LastName = "Pham Ngoc",
        Dob = new DateTime(2000, 02, 02),
        JoinDate = DateTime.Now,
        Gender = "Male",
        Type = (Role)0,
        LastNameFirstChar = "PN",
        CountDuplicate = "",
        UserName = "thangpn",
        NormalizedUserName = "THANGPN",
        IsDisabled = true,
        PasswordHash = "AQAAAAEAACcQAAAAEHePd1dt5Al4lcPaoeC0papVqdjFjFcS+WIkyVtyWMLZQ7dYkqQkqmv0GRqe8hynSA==",
        SecurityStamp = "YW2QQJB73HDDCBMF7R4ZSSQ3GOVCHHLH",
        ConcurrencyStamp = "d8ce1328-d1ec-4d00-b5b2-f022dc58c484",
      });
      modelBuilder.Entity<IdentityUserRole<int>>().HasData(
        new IdentityUserRole<int>
        {
          UserId = 1,
          RoleId = 1,
        },
         new IdentityUserRole<int>
         {
           UserId = 2,
           RoleId = 1,
         },
         new IdentityUserRole<int>
         {
           UserId = 3,
           RoleId = 1,
         }
      );
    }
  }
}
