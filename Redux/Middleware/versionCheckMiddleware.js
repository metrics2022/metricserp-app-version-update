import VersionCheck from 'react-native-version-check';


const versionCheckMiddleware = store => next => async action => {
    if (action.type.endsWith('_SUCCESS')) {
        const serverVersion = action.payload?.version?.android_version; // Assuming version is returned in the response
        // console.log(serverVersion , "serverVersion")
        const currentVersion = VersionCheck.getCurrentVersion();
        
        if (serverVersion > currentVersion) {
            alert('A new version of the app is available. Please update to the latest version.');
            return; // Prevents the action from being passed to the reducer
        }
    }
    
    return next(action); // Passes the action to the next middleware or reducer
};

export default versionCheckMiddleware;