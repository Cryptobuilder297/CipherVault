import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import { 
  useGetAdminStats, 
  useListAdminUsers, useUpdateAdminUser, getListAdminUsersQueryKey,
  useListAdminDeposits, useUpdateAdminDeposit, getListAdminDepositsQueryKey,
  useListAdminWithdrawals, useUpdateAdminWithdrawal, getListAdminWithdrawalsQueryKey,
  useListAdminInvestments
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Users, ArrowDownCircle, ArrowUpCircle, TrendingUp, Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const queryClient = useQueryClient();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-mono font-bold tracking-tight">Admin Console</h1>

      {statsLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{formatCurrency(stats.totalDeposited)}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingDeposits} pending</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{formatCurrency(stats.totalWithdrawn)}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingWithdrawals} pending</p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">{formatCurrency(stats.totalInvested)}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats.activeInvestments} active</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 border border-border rounded-xl bg-card overflow-hidden">
          <TabsContent value="users" className="m-0">
            <UsersTable queryClient={queryClient} />
          </TabsContent>
          
          <TabsContent value="deposits" className="m-0">
            <DepositsTable queryClient={queryClient} />
          </TabsContent>

          <TabsContent value="withdrawals" className="m-0">
            <WithdrawalsTable queryClient={queryClient} />
          </TabsContent>

          <TabsContent value="investments" className="m-0">
            <InvestmentsTable />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function UsersTable({ queryClient }: any) {
  const { data, isLoading } = useListAdminUsers();
  const update = useUpdateAdminUser();

  const handleToggleActive = (id: number, isActive: boolean) => {
    update.mutate({ id, data: { isActive } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminUsersQueryKey() })
    });
  };

  const handleToggleRole = (id: number, currentRole: string) => {
    const role = currentRole === 'admin' ? 'user' : 'admin';
    update.mutate({ id, data: { role } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminUsersQueryKey() })
    });
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto" /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(user => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell className="font-mono text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="font-mono">{formatCurrency(user.balance)}</TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleToggleRole(user.id, user.role)}
                disabled={update.isPending}
                className={user.role === 'admin' ? 'text-primary' : ''}
              >
                {user.role}
              </Button>
            </TableCell>
            <TableCell>
              <Switch 
                checked={user.isActive} 
                onCheckedChange={(c) => handleToggleActive(user.id, c)} 
                disabled={update.isPending}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DepositsTable({ queryClient }: any) {
  const { data, isLoading } = useListAdminDeposits();
  const update = useUpdateAdminDeposit();

  const handleStatus = (id: number, status: string) => {
    update.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminDepositsQueryKey() })
    });
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto" /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(d => (
          <TableRow key={d.id}>
            <TableCell className="font-mono text-sm">{new Date(d.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-muted-foreground">{d.userEmail}</TableCell>
            <TableCell className="font-mono font-medium">{formatCurrency(d.amount)}</TableCell>
            <TableCell className="capitalize">{d.method.replace('_', ' ')}</TableCell>
            <TableCell>
              <Badge variant="outline" className={d.status === 'pending' ? 'text-amber-400' : d.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}>
                {d.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {d.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" className="text-emerald-400 hover:text-emerald-300" onClick={() => handleStatus(d.id, 'approved')} disabled={update.isPending}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleStatus(d.id, 'rejected')} disabled={update.isPending}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function WithdrawalsTable({ queryClient }: any) {
  const { data, isLoading } = useListAdminWithdrawals();
  const update = useUpdateAdminWithdrawal();

  const handleStatus = (id: number, status: string) => {
    update.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListAdminWithdrawalsQueryKey() })
    });
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto" /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(w => (
          <TableRow key={w.id}>
            <TableCell className="font-mono text-sm">{new Date(w.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-muted-foreground">{w.userEmail}</TableCell>
            <TableCell className="font-mono font-medium">{formatCurrency(w.amount)}</TableCell>
            <TableCell className="font-mono text-xs max-w-[150px] truncate" title={w.address}>{w.address}</TableCell>
            <TableCell>
              <Badge variant="outline" className={w.status === 'pending' ? 'text-amber-400' : w.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}>
                {w.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {w.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" className="text-emerald-400 hover:text-emerald-300" onClick={() => handleStatus(w.id, 'approved')} disabled={update.isPending}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleStatus(w.id, 'rejected')} disabled={update.isPending}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function InvestmentsTable() {
  const { data, isLoading } = useListAdminInvestments();

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto" /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start Date</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Invested</TableHead>
          <TableHead>Expected</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(inv => (
          <TableRow key={inv.id}>
            <TableCell className="font-mono text-sm">{new Date(inv.startDate).toLocaleDateString()}</TableCell>
            <TableCell className="text-muted-foreground">{inv.userEmail}</TableCell>
            <TableCell className="font-medium">{inv.planName}</TableCell>
            <TableCell className="font-mono">{formatCurrency(inv.amount)}</TableCell>
            <TableCell className="font-mono text-emerald-400">{formatCurrency(inv.expectedReturn)}</TableCell>
            <TableCell>
              <Badge variant="outline" className={inv.status === 'active' ? 'text-primary' : 'text-emerald-400'}>
                {inv.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}