import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    '&:hover': {
      textDecoration: 'none',
    },
  }
}));

const ListItemLink = ({ primary, to }) => {
  const classes = useStyles();
  const CustomLink = React.useMemo(
    () => React.forwardRef((linkProps, ref) => <Link ref={ref} to={to} {...linkProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={CustomLink} className={classes.appBar} >
        <ListItemText disableTypography style={{ color: '#FFFFFF' }} primary={primary} />
      </ListItem>
    </li>
  );
};

export default ListItemLink;
