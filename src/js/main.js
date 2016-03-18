import init001 from './001.js'
import init002 from './002.js'
import init003 from './003.js'
import init004 from './004.js'
import init005 from './005.js'
import init006 from './006.js'
import init007 from './007.js'
import init008 from './008.js'
import init009 from './009.js'
import init010 from './010.js'
import init011 from './011.js'
import init012 from './012.js'
import init013 from './013.js'

const { pathname } = window.location;

const init = () => {
  switch (pathname) {
    case '/001.html': init001(); break;
    case '/002.html': init002(); break;
    case '/003.html': init003(); break;
    case '/004.html': init004(); break;
    case '/005.html': init005(); break;
    case '/006.html': init006(); break;
    case '/007.html': init007(); break;
    case '/008.html': init008(); break;
    case '/009.html': init009(); break;
    case '/010.html': init010(); break;
    case '/011.html': init011(); break;
    case '/012.html': init012(); break;
    case '/013.html': init013(); break;
    default:
  }
}
init();
