import express from 'express';
// import path from 'path';
// import cookieParser from 'cookie-parser';
// import logger from 'morgan';
//import indexRouter from './routes/index';
//import usersRouter from './routes/users';

const app = express();
const port = process.env.PORT || 3000;

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.get('/', (_, res) => {
    res.send('Hello from Express + TypeScript + esbuild (ESM)');
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});