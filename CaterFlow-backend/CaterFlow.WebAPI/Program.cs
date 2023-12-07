using Caterflow.BLL.Services;
using Caterflow.BLL.Services.CategoryService;
using Caterflow.BLL.Services.CateringUnitService;
using Caterflow.BLL.Services.OrderService;
using Caterflow.BLL.Services.ProductService;
using Caterflow.BLL.Services.TableService;
using Caterflow.BLL.Services.UserService;
using CaterFlow.DAL;
using CaterFlow.DAL.Entities;
using CaterFlow.DAL.SeedServices;
using CaterFlow.WebAPI.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using TicketingSystemBLL.HubConfig;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<ICateringUnitService, CateringUnitService>();
builder.Services.AddScoped<IUserSeedService, UserSeedService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ITableService, TableService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<TokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddIdentity<User, IdentityRole<int>>()
    .AddEntityFrameworkStores<CaterFlowDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;
    options.User.RequireUniqueEmail = true;
});

// Add services to the container.
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = "http://localhost:7251",
        ValidAudience = "http://localhost:7251",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("CaterFlowSecretKeyHopesLongEnoughForMeSoNotGettingError"))
    };
});
builder.Services.AddAuthorization();

builder.Services.AddSignalR();
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<CaterFlowDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString(nameof(CaterFlowDbContext)));
});

builder.Services.AddCors(options => options.AddPolicy(name: "CaterFlowOrigins",
    policy =>
    {
        policy.WithOrigins("http://localhost:19006").AllowAnyMethod().AllowAnyHeader().AllowCredentials();
    }));

var app = builder.Build();

await app.MigrateDatabase<CaterFlowDbContext>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CaterFlowOrigins");

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapHub<SubOrderHub>("/suborder");
app.Run();
