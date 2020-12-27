using System;
using System.Text;
using AutoMapper;
using backend.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace backend
{
  public class Startup
  {
    readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
      var secret = Environment.GetEnvironmentVariable("JWT_SECRET");
      var mySecurityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));

      services.AddCors(o =>
      {
        o.AddPolicy(name: MyAllowSpecificOrigins, builder =>
        {
          builder.WithOrigins("http://localhost:5500");
        });
      });

      services.AddControllers();
      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
      {
        opt.Audience = "http://localhost:5500";
        opt.Authority = "http://localhost:8080";
        opt.RequireHttpsMetadata = false;
        opt.TokenValidationParameters = new TokenValidationParameters
        {
          ClockSkew = TimeSpan.FromMinutes(5),
          IssuerSigningKey = mySecurityKey,
          RequireSignedTokens = true,
          RequireExpirationTime = true,
          ValidateLifetime = true,
        };
      });
      services.AddAutoMapper(typeof(Startup));
      services.AddSingleton<UserService>();
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "backend", Version = "v1" });
      });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "backend v1"));
      }

      app.UseHttpsRedirection();

      app.UseRouting();
      app.UseCors(MyAllowSpecificOrigins);

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
