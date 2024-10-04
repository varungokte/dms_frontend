import { createContext } from 'react';
import socket from './socket';
import { FieldValues, MastersValues } from '@/types/DataTypes';

const PermissionContext = createContext<{userPermissions:FieldValues}>({userPermissions:{}});

const SocketContext = createContext(socket);

const MasterValuesContext = createContext<MastersValues|undefined>(undefined);


export  { PermissionContext, SocketContext, MasterValuesContext };