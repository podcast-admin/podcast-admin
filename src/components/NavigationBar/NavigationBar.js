import {
  MoreVert,
  Album,
  AudioFile,
  Settings,
  Logout,
  Language,
  People,
} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Link,
  Avatar,
} from '@mui/material';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useNavigate,
  useParams,
  Outlet,
  Link as LinkRouter,
} from 'react-router-dom';

import { auth } from '../../helpers/Firebase';

const NavigationBar = () => {
  const navigate = useNavigate();
  const { podcastId } = useParams();
  const { t, i18n } = useTranslation();
  const handleSignOut = () => {
    signOut(auth);
    navigate('/login');
  };

  const [anchorElPodcastMenu, setAnchorElPodcastMenu] = React.useState(null);
  const openPodcastMenu = Boolean(anchorElPodcastMenu);
  const handleClickPodcastMenu = (event) => {
    setAnchorElPodcastMenu(event.currentTarget);
  };
  const handleClosePodcastMenu = () => {
    setAnchorElPodcastMenu(null);
  };

  const [anchorElAccountMenu, setAnchorElAccountMenu] = React.useState(null);
  const openAccountMenu = Boolean(anchorElAccountMenu);
  const handleClickAccountMenu = (event) => {
    setAnchorElAccountMenu(event.currentTarget);
  };
  const handleCloseAccountMenu = () => {
    setAnchorElAccountMenu(null);
  };

  const toggleLocale = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en');
  };

  const paperProps = {
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5,
      '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  };

  const [user, setUser] = useState();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link
            component={LinkRouter}
            sx={{ display: { xs: 'none', sm: 'inline' }, flexGrow: 1 }}
            variant="h6"
            to="/"
            color="inherit"
            underline="none"
          >
            Podcast Admin
          </Link>
          {user ? (
            <Box>
              <Button
                color="inherit"
                onClick={() => navigate(`/podcasts/${podcastId}/episodes`)}
                startIcon={<Album />}
              >
                {t('NavigationBar.allEpisodes')}
              </Button>
              <Tooltip title="Podcast settings">
                <IconButton
                  color="inherit"
                  onClick={handleClickPodcastMenu}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={openPodcastMenu ? 'podcast-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openPodcastMenu ? 'true' : undefined}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('NavigationBar.accountSettings')}>
                <IconButton
                  color="inherit"
                  onClick={handleClickAccountMenu}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={openAccountMenu ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openAccountMenu ? 'true' : undefined}
                >
                  <Avatar src={user.photoURL} />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorElPodcastMenu}
        id="podcast-menu"
        open={openPodcastMenu}
        onClose={handleClosePodcastMenu}
        onClick={handleClosePodcastMenu}
        PaperProps={paperProps}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          component={Link}
          onClick={() => navigate(`/podcasts/${podcastId}/users`)}
        >
          <ListItemIcon>
            <People fontSize="small" />
          </ListItemIcon>
          {t('NavigationBar.users')}
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={() => navigate(`/podcasts/${podcastId}/intro-outro`)}
        >
          <ListItemIcon>
            <AudioFile fontSize="small" />
          </ListItemIcon>
          {t('NavigationBar.editIntroOutro')}
        </MenuItem>
        <MenuItem
          component={Link}
          onClick={() => navigate(`/podcasts/${podcastId}/edit`)}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('NavigationBar.editPodcast')}
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchorElAccountMenu}
        id="account-menu"
        open={openAccountMenu}
        onClose={handleCloseAccountMenu}
        onClick={handleCloseAccountMenu}
        PaperProps={paperProps}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={toggleLocale}>
          <ListItemIcon>
            <Language fontSize="small" />
          </ListItemIcon>
          {t(`NavigationBar.langSwitch.${i18n.language}`)}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('NavigationBar.signout')}
        </MenuItem>
      </Menu>
      <Outlet />
    </>
  );
};

export default NavigationBar;
