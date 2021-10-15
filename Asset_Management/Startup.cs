using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Asset_Management.Repositories.EFContext;
using Asset_Management.Repositories.Entities;
using Asset_Management.Services.AdminService;
using Asset_Management.Services.AssetService;
using Asset_Management.Services.AssignmentService;
using Asset_Management.Services.AssignmentService.implements;
using Asset_Management.Services.AuthenticationService;
using Asset_Management.Services.CategoriesService;
using Asset_Management.Services.CommonService;
using Asset_Management.Services.ReportService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Asset_Management
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<AssetDBContext>(options => options.UseSqlServer("name=ConnectionStrings:DefaultConnection"));
      services.AddControllers();
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Asset_Management", Version = "v1" });
      });
      services.AddIdentity<AppUser, AppRole>()
              .AddEntityFrameworkStores<AssetDBContext>()
              .AddDefaultTokenProviders();
      services.AddScoped<SignInManager<AppUser>, SignInManager<AppUser>>();
      services.AddScoped<RoleManager<AppRole>, RoleManager<AppRole>>();
      services.AddScoped<IReportService, ReportService>();
      services.AddScoped<IAuthenticationService, AuthenticationService>();
      services.AddCors(
                      options =>
                      {
                        options.AddDefaultPolicy(
                                  builder =>
                                  {
                                    builder.AllowAnyOrigin()
                                          .AllowAnyHeader()
                                          .AllowAnyMethod();
                                  });
                      }
                  );
      services.AddControllers().AddNewtonsoftJson(options =>
               options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
      services.AddAuthentication(options =>
   {
     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
     options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
   })

   // Adding Jwt Bearer
   .AddJwtBearer(options =>
   {
     options.SaveToken = true;
     options.RequireHttpsMetadata = false;
     options.TokenValidationParameters = new TokenValidationParameters()
     {
       ValidateIssuer = true,
       ValidateAudience = true,
       ValidAudience = Configuration["Tokens:Issuer"],
       ValidIssuer = Configuration["Tokens:Issuer"],
       IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Tokens:Key"]))
     };
   });
      services.AddScoped<IAdminService, AdminService>();
      services.AddScoped<UserManager<AppUser>, UserManager<AppUser>>();
      services.AddScoped<IAdminCommonService, AdminCommonService>();
      services.AddScoped<IAssetService, AssetService>();
      services.AddScoped<ICategoriesService, CategoriesService>();
      services.AddScoped<IAdminAssignmentService, AdminAssignmentService>();
      services.AddScoped<IUserAssignmentService, UserAssignmentService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Asset_Management v1"));
      }

      app.UseCors();

      app.UseHttpsRedirection();

      app.UseRouting();
      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
