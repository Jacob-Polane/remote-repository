/*
CORS Setup for ASP.NET Core

Add this to your Program.cs or Startup.cs file:

1. For Program.cs (ASP.NET Core 6+):
*/

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Your React app's URL (default React port is 3000)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// In the app configuration section:
app.UseCors("AllowReactApp");

/*
2. For Startup.cs (ASP.NET Core 3.1-5.0):

public void ConfigureServices(IServiceCollection services)
{
    services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp", policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Your React app's URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });
    
    // Other service configurations...
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    // Other middleware...
    
    app.UseCors("AllowReactApp");
    
    // Other middleware...
}
*/

// Note: Make sure to place app.UseCors() before app.UseRouting() and app.UseEndpoints() 