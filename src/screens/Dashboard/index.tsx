import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps
} from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadingContaier
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState([] as DataListProps[]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'up' | 'down'
  ){
    const lastTransaction = new Date(
      Math.max.apply(Math, collection
        .filter(item => item.type === type)
        .map(item => new Date(item.date).getTime())
      )
    );

    return `${lastTransaction.getDay()} de ${lastTransaction.toLocaleDateString('pt-BR', { month: 'long' })}`
  }

  async function loadTransactions() {
    try{
      const dataKey = '@gofinances:transactions';
      const response = await AsyncStorage.getItem(dataKey);
      const storedTransactions =  response ? JSON.parse(response) : [];

      let totalEntries = 0;
      let totalExpenses = 0;

      const transactionsFormatted: DataListProps[] = storedTransactions
      .map((item: DataListProps) => {
        if(item.type === 'up') {
          totalEntries += Number(item.amount);
        } else {
          totalExpenses += Number(item.amount);
        }

        const amount = Number(item.amount)
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const formattedDate = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date: formattedDate
        };
      });

      setTransactions(transactionsFormatted);

      const lastEntryDate = getLastTransactionDate(storedTransactions, 'up');
      const lastExpenseDate = getLastTransactionDate(storedTransactions, 'down');
      const totalInterval = `01 a ${lastExpenseDate}`;

      const total = totalEntries - totalExpenses;

      setHighlightData({
        expenses: {
          amount: totalExpenses.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: lastEntryDate
        },
        entries: {
          amount: totalEntries.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: lastExpenseDate
        },
        total: {
          amount: total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          lastTransaction: totalInterval
        }
      })
      setIsLoading(false);
    } catch(err) {
      Alert.alert('Erro ao carregar informações');
      console.log(err);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  if (isLoading) {
    return (
      <LoadingContaier>
        <ActivityIndicator
          color={theme.colors.primary}
          size='large'
        />
      </LoadingContaier>
    );
  }

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{ uri: 'https://avatars.githubusercontent.com/u/50638499?v=4' }}
            />
            <User>
              <UserGreeting>Olá, </UserGreeting>
              <UserName>Vinicius</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name='power'/>
          </LogoutButton>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          type='up'
          title='Entradas'
          amount={highlightData.entries?.amount}
          lastTransaction={`Última entrada dia ${highlightData.entries.lastTransaction}`}
        />
        <HighlightCard
          type='down'
          title='Saídas'
          amount={highlightData.expenses?.amount}
          lastTransaction={`Última saída dia ${highlightData.expenses.lastTransaction}`}
        />
        <HighlightCard
          type='total'
          title='Total'
          amount={highlightData.total?.amount}
          lastTransaction={highlightData.total.lastTransaction}
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TransactionCard data={item} />
          )}
        />
      </Transactions>
    </Container>
  );
}
