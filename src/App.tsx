import { createRouter, createRoute, createRootRoute, RouterProvider, Link, Outlet, useNavigate, useParams } from '@tanstack/react-router';
import { Home, UserPlus, Mail, ShieldCheck, Trophy, Info, AlertTriangle, Menu, X, LayoutDashboard, LogIn, UserCog, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from './hooks/useAuth';
import { blink } from './blink/client';
import { toast } from 'react-hot-toast';
import { BlinkAuthError } from '@blinkdotnew/sdk';

// Layout Component
const RootLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground scanline flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:fortnite-glow transition-all duration-300">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase italic text-primary">Fortnite Cup Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Accueil</Link>
            <Link to="/register" className="text-sm font-medium hover:text-primary transition-colors">S'inscrire</Link>
            <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <Link to="/login">
                <Button variant="ghost" className="hover:text-primary flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-primary">{user?.displayName || user?.email?.split('@')[0]}</span>
                  <span className="text-[10px] text-muted-foreground">{isAdmin ? 'ADMINISTRATEUR' : 'MEMBRE'}</span>
                </div>
                <Button onClick={logout} variant="outline" size="sm" className="h-8">Quitter</Button>
              </div>
            )}
            <Link to="/register">
              <Button className="bg-primary text-primary-foreground fortnite-glow hover:bg-primary/90">
                Participer
              </Button>
            </Link>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-xl border-t border-white/5 p-4 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col gap-6 pt-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-white/5 pb-2">Accueil</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-white/5 pb-2">S'inscrire</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-white/5 pb-2">Contact</Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium border-b border-white/5 pb-2 text-accent">Admin Dashboard</Link>
              )}
              <div className="mt-4 flex flex-col gap-4">
                {!isAuthenticated ? (
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-left justify-start">Se connecter</Button>
                  </Link>
                ) : (
                  <Button onClick={logout} variant="outline" className="w-full">Se déconnecter</Button>
                )}
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground fortnite-glow">Participer</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 py-12 bg-card/20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg uppercase italic text-primary">Fortnite Cup Hub</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
              La destination ultime pour les compétitions communautaires sur Fortnite.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <Link to="/register" className="hover:text-primary transition-colors">Inscription</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="text-xs text-muted-foreground text-center md:text-right">
            © 2026 Fortnite Cup Hub. Ce site n'est pas affilié à Epic Games.
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- PAGES ---

// Home Page
const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 animate-pulse-glow">
            NOUVELLE COMPÉTITION DISPONIBLE
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic leading-none">
            FAITES VOS <span className="text-primary italic">PREUVES</span> <br />
            SUR LE TERRAIN
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Inscris-toi dès maintenant pour participer aux prochains tournois et tente de gagner jusqu'à 30€.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/register">
              <Button size="lg" className="h-14 px-10 text-lg bg-primary text-primary-foreground fortnite-glow hover:bg-primary/90 font-bold uppercase italic transition-transform hover:scale-105">
                S'inscrire au Tournoi
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-white/10 hover:bg-white/5 font-bold uppercase italic">
                Poser une Question
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 bg-card/10 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 bg-primary rounded-full" />
                <h2 className="text-3xl font-bold uppercase tracking-tight italic">Règles & Conditions</h2>
              </div>
              <p className="text-muted-foreground">
                Notre plateforme est conçue pour offrir une expérience de jeu juste et sécurisée à notre communauté.
              </p>
              
              <div className="grid gap-4 mt-4">
                {[
                  { icon: ShieldCheck, title: "Pas de Bots", desc: "Seuls les vrais joueurs sont autorisés. Les tricheurs sont bannis." },
                  { icon: Info, title: "Âge Requis", desc: "La compétition est réservée aux joueurs âgés de 13 à 16 ans." },
                  { icon: AlertTriangle, title: "Fair-play", desc: "Tout comportement toxique entraînera une disqualification immédiate." }
                ].map((rule, i) => (
                  <Card key={i} className="glass-card border-l-4 border-l-primary/50 overflow-hidden">
                    <CardHeader className="p-4 flex flex-row items-center gap-4">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                        <rule.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base uppercase tracking-wider">{rule.title}</CardTitle>
                        <CardDescription className="text-xs">{rule.desc}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full -z-10 group-hover:bg-accent/30 transition-all duration-500" />
              <Card className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Trophy className="w-24 h-24 rotate-12" />
                </div>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">
                  Lots à <span className="text-accent underline decoration-4">Gagner</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Les récompenses varient selon l'importance du tournoi. Nous organisons régulièrement des événements pour dynamiser la chaîne !
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Tournoi Classique</span>
                    <span className="text-2xl font-bold text-primary">10 €</span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-accent/30">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">Tournoi Premium</span>
                    <span className="text-2xl font-bold text-accent">30 €</span>
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Participation</span>
                    <span className="font-bold">2 €</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase text-center mt-2 italic">
                    Les détails des transactions sont gérés anonymement via email.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Register Page
const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      id: `reg_${Date.now()}`,
      name: formData.get('name') as string,
      surname: formData.get('surname') as string,
      age: parseInt(formData.get('age') as string),
      email: formData.get('email') as string,
    };

    try {
      // 1. Store in DB
      await blink.db.registrations.create(data);
      
      // 2. Send Email Notification (to the owner)
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@blink.new';
      await blink.notifications.email({
        to: adminEmail,
        subject: `Nouvelle Inscription: ${data.name} ${data.surname}`,
        html: `
          <h1>Nouvelle Inscription au Tournoi</h1>
          <p><strong>Nom:</strong> ${data.name}</p>
          <p><strong>Prénom:</strong> ${data.surname}</p>
          <p><strong>Âge:</strong> ${data.age}</p>
          <p><strong>Email:</strong> ${data.email}</p>
        `
      });

      toast.success("Inscription envoyée avec succès !");
      navigate({ to: '/' });
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'inscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <Card className="w-full max-w-lg glass-card p-6 md:p-10">
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center fortnite-glow">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Inscription au Tournoi</h1>
          <p className="text-sm text-muted-foreground">
            Remplis les informations ci-dessous pour rejoindre la compétition.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="surname">Nom</Label>
              <Input id="surname" name="surname" placeholder="Ton nom" required className="bg-white/5 border-white/10 focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Prénom</Label>
              <Input id="name" name="name" placeholder="Ton prénom" required className="bg-white/5 border-white/10 focus:border-primary/50" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Âge (13-16 ans)</Label>
            <Input id="age" name="age" type="number" min="13" max="16" placeholder="Ton âge" required className="bg-white/5 border-white/10 focus:border-primary/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Gmail</Label>
            <Input id="email" name="email" type="email" placeholder="ton-email@gmail.com" required className="bg-white/5 border-white/10 focus:border-primary/50" />
          </div>

          <Badge variant="secondary" className="w-full justify-center py-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 gap-2 mb-4">
            <AlertTriangle className="w-3 h-3" />
            Frais de participation: 2€ (géré via email après inscription)
          </Badge>

          <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground fortnite-glow hover:bg-primary/90 font-bold uppercase italic" disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Envoyer mon Inscription"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// Contact Page
const ContactPage = () => {
  // ... existing code ...
};

// Login Page
const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get('identifier') as string;
    const password = formData.get('password') as string;

    // Map username to internal email format if it doesn't look like an email
    const email = identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@system.local`;

    try {
      await signIn(email, password);
      toast.success("Connexion réussie !");
      navigate({ to: '/' });
    } catch (error: any) {
      // If it's the specific admin account and it's the first time, try to sign up
      if (identifier === 'Artemiko132' && password === 'Polyakov2011' && error.message?.includes('401')) {
        try {
          await blink.auth.signUp({
            email,
            password,
            displayName: 'Artemiko132',
            role: 'admin'
          });
          toast.success("Compte Admin créé et connecté !");
          navigate({ to: '/' });
          return;
        } catch (signupError) {
          console.error(signupError);
        }
      }
      
      console.error(error);
      toast.error("Identifiants incorrects.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <Card className="w-full max-w-md glass-card p-6 md:p-10">
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center fortnite-glow">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Entrez votre identifiant pour accéder à votre espace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="identifier">Identifiant / Email</Label>
            <Input id="identifier" name="identifier" placeholder="Artemiko132" required className="bg-white/5 border-white/10 focus:border-primary/50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required className="bg-white/5 border-white/10 focus:border-primary/50" />
          </div>

          <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground fortnite-glow hover:bg-primary/90 font-bold uppercase italic" disabled={isSubmitting}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

// Admin Page
const AdminPage = () => {
  const { isAdmin, loading } = useAuth();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalReg: 0, totalMsg: 0 });
  const [activeTab, setActiveTab] = useState<'data' | 'users'>('data');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      const fetchData = async () => {
        try {
          const [regList, msgList] = await Promise.all([
            blink.db.registrations.list({ orderBy: { created_at: 'desc' } }),
            blink.db.messages.list({ orderBy: { created_at: 'desc' } })
          ]);
          setRegistrations(regList);
          setMessages(msgList);
          setStats({ totalReg: regList.length, totalMsg: msgList.length });
        } catch (err) {
          console.error("Fetch error:", err);
        }
      };
      fetchData();
    }
  }, [isAdmin]);

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingUser(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const metadataStr = formData.get('metadata') as string;

    try {
      let metadata = {};
      try {
        if (metadataStr) metadata = JSON.parse(metadataStr);
      } catch (e) {
        toast.error("Format JSON des paramètres invalide.");
        setIsCreatingUser(false);
        return;
      }

      const email = `${username.toLowerCase()}@system.local`;
      await blink.auth.signUp({
        email,
        password,
        displayName: username,
        role,
        metadata
      });
      toast.success(`Compte ${username} créé avec succès !`);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de la création du compte.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold italic tracking-tighter animate-pulse text-primary text-4xl">CHARGEMENT...</div>;
  if (!isAdmin) return <div className="h-screen flex items-center justify-center text-destructive text-2xl font-black uppercase italic">ACCÈS REFUSÉ.</div>;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <LayoutDashboard className="w-10 h-10 text-primary" />
            Dashboard Admin
          </h1>
          <p className="text-muted-foreground">Gestion complète de la compétition et des accès.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'data' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('data')}
            className="gap-2"
          >
            <Trophy className="w-4 h-4" /> Données
          </Button>
          <Button 
            variant={activeTab === 'users' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('users')}
            className="gap-2"
          >
            <UserCog className="w-4 h-4" /> Utilisateurs
          </Button>
        </div>
      </div>

      {activeTab === 'data' ? (
        <div className="grid lg:grid-cols-2 gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold uppercase italic flex items-center gap-2 text-primary">
              <UserPlus className="w-6 h-6" /> Inscriptions ({stats.totalReg})
            </h2>
            <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {registrations.length === 0 ? (
                <p className="text-muted-foreground italic bg-white/5 p-4 rounded-lg">Aucune inscription pour le moment.</p>
              ) : (
                registrations.map((reg) => (
                  <Card key={reg.id} className="glass-card group hover:border-primary/50 transition-all duration-300">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">{reg.name} {reg.surname}</CardTitle>
                          <CardDescription className="flex flex-col gap-1 mt-1">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {reg.email}</span>
                            <span className="flex items-center gap-1"><Info className="w-3 h-3" /> {reg.age} ans</span>
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{new Date(reg.created_at).toLocaleString()}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold uppercase italic flex items-center gap-2 text-accent">
              <Mail className="w-6 h-6" /> Messages ({stats.totalMsg})
            </h2>
            <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {messages.length === 0 ? (
                <p className="text-muted-foreground italic bg-white/5 p-4 rounded-lg">Aucun message pour le moment.</p>
              ) : (
                messages.map((msg) => (
                  <Card key={msg.id} className="glass-card group hover:border-accent/50 transition-all duration-300">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg group-hover:text-accent transition-colors">{msg.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1"><Mail className="w-3 h-3" /> {msg.email}</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{new Date(msg.created_at).toLocaleString()}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold uppercase italic flex items-center gap-2 text-primary">
                <UserCog className="w-6 h-6" /> Créer un Identifiant
              </h2>
              <p className="text-sm text-muted-foreground">Ajoutez de nouveaux membres ou administrateurs à la plateforme.</p>
            </div>
            
            <Card className="glass-card p-6 border-primary/20">
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label>Identifiant (Username)</Label>
                  <Input name="username" placeholder="ex: JoueurPro123" required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <Input name="password" type="password" placeholder="••••••••" required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Rôle</Label>
                  <select name="role" className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="user" className="bg-background">Utilisateur (Membre)</option>
                    <option value="admin" className="bg-background">Administrateur</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Paramètres (JSON) <Settings className="w-3 h-3" />
                  </Label>
                  <Textarea name="metadata" placeholder='{ "equipe": "Alpha", "lvl": 50 }' className="bg-white/5 border-white/10 min-h-[80px] font-mono text-xs" />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold uppercase italic" disabled={isCreatingUser}>
                  {isCreatingUser ? "Création..." : "Générer l'Identifiant"}
                </Button>
              </form>
            </Card>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold uppercase italic flex items-center gap-2 text-accent">
                <Settings className="w-6 h-6" /> Info Système
              </h2>
              <p className="text-sm text-muted-foreground">Notes sur la gestion des comptes.</p>
            </div>
            <Card className="glass-card p-6 border-accent/20 space-y-4">
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/10 space-y-3">
                <p className="text-sm leading-relaxed">
                  <span className="font-bold text-accent">SÉCURITÉ:</span> Les identifiants créés ici permettent aux utilisateurs de se connecter via la page de Login.
                </p>
                <Separator className="bg-accent/10" />
                <p className="text-sm leading-relaxed">
                  <span className="font-bold text-accent">PARAMÈTRES:</span> Vous pouvez stocker n'importe quel paramètre supplémentaire dans le champ JSON. Ces informations seront visibles dans le profil de l'utilisateur.
                </p>
                <Separator className="bg-accent/10" />
                <p className="text-sm leading-relaxed">
                  <span className="font-bold text-accent">ROLES:</span> Les administrateurs ont accès à ce dashboard, les utilisateurs classiques ne voient que les pages publiques.
                </p>
              </div>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
};

// --- ROUTER CONFIG ---

const rootRoute = createRootRoute({ component: RootLayout });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/register', component: RegisterPage });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ContactPage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage });
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminPage });

const routeTree = rootRoute.addChildren([indexRoute, registerRoute, contactRoute, loginRoute, adminRoute]);
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

export default function App() {
  return <RouterProvider router={router} />;
}
