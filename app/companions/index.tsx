import { type Href, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';

import { CompanionCard } from '../../components/companions/CompanionCard';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { ScreenLayout } from '../../components/ScreenLayout';
import { paperSearchbarStyle } from '../../constants/ui';
import { useCompanions } from '../../hooks/useCompanions';
import type { Companion } from '../../types';

export default function CompanionsListScreen() {
  const { companions, isLoading, refreshCompanions, removeCompanion } = useCompanions();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Companion | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void refreshCompanions();
    }, [refreshCompanions])
  );

  const filteredCompanions = companions.filter((companion) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return true;
    }
    return (
      companion.name.toLowerCase().includes(query) ||
      companion.phone.toLowerCase().includes(query) ||
      companion.email.toLowerCase().includes(query)
    );
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshCompanions();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    await removeCompanion(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (isLoading && companions.length === 0) {
    return (
      <ScreenLayout title="Попутчики">
        <LoadingIndicator />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout title="Попутчики">
      <Searchbar
        placeholder="Поиск по имени, телефону, email"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={paperSearchbarStyle}
      />

      {filteredCompanions.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'Ничего не найдено' : 'Нет попутчиков'}
          message={
            searchQuery
              ? 'Попробуйте другой запрос'
              : 'Добавьте контакты попутчиков для быстрого звонка и сообщений'
          }
        />
      ) : (
        <FlatList
          data={filteredCompanions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void handleRefresh()} />}
          renderItem={({ item }) => (
            <CompanionCard
              companion={item}
              onPress={() => router.push(`/companions/${item.id}` as Href)}
              onDelete={() => setDeleteTarget(item)}
              showActions
            />
          )}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/companions/new' as Href)}
      />

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="Удалить попутчика?"
        message={
          deleteTarget
            ? `Контакт «${deleteTarget.name}» будет удалён из всех мест.`
            : ''
        }
        onConfirm={() => void handleDelete()}
        onDismiss={() => setDeleteTarget(null)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 88,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
