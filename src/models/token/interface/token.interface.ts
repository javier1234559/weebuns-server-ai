import { TokenPackage, TokenWallet, Transaction } from '@prisma/client';

export interface ITokenPackage extends TokenPackage {}
export interface ITokenWallet extends TokenWallet {}
export interface ITransaction extends Transaction {}
