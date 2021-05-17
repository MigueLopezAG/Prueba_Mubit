  
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

//Material ui importis
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

//Styles to all the view
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  image: {
    backgroundImage: 'url(https://www.imprimirmirevista.es/blog/wp-content/uploads/2014/08/catalogo-productos.png)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'autos',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

//Global Variables, which we are going to use to sabe and make the division to get the denominations 
let remain = [0,0,0,0,0,0,0,0,0,0,0];
const denomination = [
  1000,
  500,
  200,
  100,
  50,
  20,
  10,
  5,
  2,
  1,
  0.5
];

function App() {
  //load all the styles for the view
  const classes = useStyles();

  //Variables to sabe and know the state of the pay
  const [amount, setAmount] = useState(0);
  const [pay, setPay] = useState(0);
  const [paid, setPaid] = useState(false);
  const [errors, setErrors] = useState({ pay: "", amount: ""});
  const [errorStatusAmount, setErrorStatusAmount] = useState(false);
  const [errorStatusPay, setErrorStatusPay] = useState(false);
  
  useEffect(() => {
    if(errors.amount !== ""){
      setErrorStatusAmount(true);
    } else {
      if(errors.pay !==""){
        setErrorStatusPay(true);
      } else{
        setErrorStatusAmount(false);
        setErrorStatusPay(false);
      }
    }  
  }, [errors]);

  //Function to make the Charge and return the denominations to give the remain
  function Charge() {
    if(pay === 0){
      setErrors({
        ...errors,
        pay: "El cliente debe pagar con alguna cantidad",
      });
    } else {
      if(amount <= pay){
        let resTemp = pay - amount;
        denomination.forEach(
          (denom, index) =>{
          if(resTemp / denom >= 1){
            remain[index] = parseInt(resTemp/denom);
          }
          resTemp = resTemp % denom;
        });
        setPaid(true);
      } else{
        setErrors({
          ...errors,
          amount: "La cantidad a pagar no puede ser mayor a la cantidad con la que va a pagar el cliente",
        });
      }
    }
  }

  //Function to reset all the values to make a new calculation
  function Reset(){
    remain = [0,0,0,0,0,0,0,0,0,0,0];
    setPaid(false);
    setAmount(0);
    setPay(0);
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={8} md={7} className={classes.image} />
      <Grid item xs={12} sm={4} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Prueba Mubit.com con REACT
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              error={errorStatusAmount}
              helperText={errors.amount}
              fullWidth
              value={amount}
              id="Total"
              type="number"
              label="Monto Total"
              name="total"
              autoFocus
              onChange={(e) => {               
                setAmount(e.target.value);
                setErrors({ amount: "", pay:"" });  
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              error={errorStatusPay}
              helperText={errors.pay}
              fullWidth
              value={pay}
              type="number"
              name="cobro"
              label="Cliente paga con..."
              id="cobro"
              onChange={(e) => {               
                setPay(e.target.value);  
                setErrors({ amount: "", pay:"" });  
              }}
            />
            <Button
              onClick={paid ? Reset : Charge}
              fullWidth
              variant="contained"
              color="primary" 
              className={classes.submit}
            >
              {paid ? "Reiniciar" : "Cobrar"}
            </Button>
          </form>
        </div>
        { paid && 
        <>
        <Typography component="h3" variant="h5">
        Cambio a entregar (Billetes y Monedas)
        </Typography>
        <List className={classes.list}>
          { denomination.map((denom, index) => {
            if(remain[index]){ 
              return (<ListItem>
                       <ListItemAvatar>
                        <Avatar>
                          <MonetizationOnIcon />
                        </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={denom} secondary={remain[index]} key={index} />
                      </ListItem>); 
            } else{
              return null;
            }
          } 
          )}
        </List></> }
      </Grid>
    </Grid>
  );
}

export default App;
