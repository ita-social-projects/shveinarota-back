import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Указываем ApolloDriver
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Для GraphQL Playground
      debug: true,      // Включение отладки
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'data', 'database.sqlite'), 
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')], 
      synchronize: true, 
    }),    
    AdminModule,
  ],
})
export class AppModule {}
