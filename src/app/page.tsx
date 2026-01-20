'use client';

import Link from 'next/link';
import {
    Calendar,
    Users,
    Briefcase,
    Building2,
    UserPlus,
    FileEdit,
    ArrowRight,
    Handshake,
    Megaphone,
    UserSearch
} from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="layout-container max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#1a151f] text-3xl md:text-4xl font-extrabold font-display tracking-tight leading-tight">
                        Bienvenido, Admin 👋
                    </h1>
                    <p className="text-[#796189] text-base font-normal">
                        Tu panel de control para la gestión estratégica de talento.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#796189] bg-white px-4 py-2 rounded-lg border border-[#f3f0f4] shadow-sm">
                    <Calendar size={18} />
                    <span>Oct 24, 2023</span>
                </div>
            </div>

            {/* Bento Box Stats Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Card 1 */}
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#B799E2] to-[#9271c4] p-6 shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 transition-transform group-hover:rotate-6">
                        <Users size={140} color="white" strokeWidth={1.5} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                        <div className="flex items-center gap-2 text-white/90">
                            <UserSearch size={20} />
                            <p className="text-sm font-semibold uppercase tracking-wider font-body">Candidatos</p>
                        </div>
                        <div>
                            <p className="text-white text-4xl md:text-5xl font-bold font-display tracking-tight">1,240</p>
                            <p className="text-white/80 text-sm mt-1 font-medium">Registrados esta semana</p>
                        </div>
                    </div>
                </div>
                {/* Card 2 */}
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#A16ECF] to-[#8046b5] p-6 shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 transition-transform group-hover:rotate-6">
                        <Briefcase size={140} color="white" strokeWidth={1.5} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                        <div className="flex items-center gap-2 text-white/90">
                            <Megaphone size={20} />
                            <p className="text-sm font-semibold uppercase tracking-wider font-body">Vacantes</p>
                        </div>
                        <div>
                            <p className="text-white text-4xl md:text-5xl font-bold font-display tracking-tight">85</p>
                            <p className="text-white/80 text-sm mt-1 font-medium">Activas actualmente</p>
                        </div>
                    </div>
                </div>
                {/* Card 3 */}
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#9C61A8] to-[#7a4685] p-6 shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-default">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 transition-transform group-hover:rotate-6">
                        <Building2 size={140} color="white" strokeWidth={1.5} />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                        <div className="flex items-center gap-2 text-white/90">
                            <Handshake size={20} />
                            <p className="text-sm font-semibold uppercase tracking-wider font-body">Aliados</p>
                        </div>
                        <div>
                            <p className="text-white text-4xl md:text-5xl font-bold font-display tracking-tight">42</p>
                            <p className="text-white/80 text-sm mt-1 font-medium">Empresas conectadas</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions Section */}
            <section className="mb-10">
                <h2 className="text-[#1a151f] text-xl font-bold font-display tracking-tight mb-6">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Action 1: Register Talent */}
                    <Link href="/applicants/new" className="group flex items-center justify-between p-6 bg-white rounded-xl border border-[#e5deeb] shadow-card hover:border-[#6200EA] hover:shadow-soft transition-all duration-200 no-underline text-left">
                        <div className="flex items-center gap-5">
                            <div className="size-14 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#6200EA] group-hover:bg-[#6200EA] group-hover:text-white transition-colors duration-200">
                                <UserPlus size={28} />
                            </div>
                            <div>
                                <h3 className="text-[#1a151f] text-lg font-bold font-display">Registrar Talento</h3>
                                <p className="text-[#796189] text-sm mt-1">Añade nuevos perfiles a la base de datos</p>
                            </div>
                        </div>
                        <div className="size-10 rounded-full bg-[#fbfaf9] flex items-center justify-center text-[#796189] group-hover:translate-x-1 transition-transform">
                            <ArrowRight size={20} />
                        </div>
                    </Link>
                    {/* Action 2: Manage Vacancies */}
                    <Link href="/vacancies" className="group flex items-center justify-between p-6 bg-white rounded-xl border border-[#e5deeb] shadow-card hover:border-[#6200EA] hover:shadow-soft transition-all duration-200 no-underline text-left">
                        <div className="flex items-center gap-5">
                            <div className="size-14 rounded-full bg-[#fbfaf9] flex items-center justify-center text-[#645c6e] group-hover:bg-[#6200EA] group-hover:text-white transition-colors duration-200">
                                <FileEdit size={28} />
                            </div>
                            <div>
                                <h3 className="text-[#1a151f] text-lg font-bold font-display">Gestionar Vacantes</h3>
                                <p className="text-[#796189] text-sm mt-1">Revisa y edita las ofertas activas</p>
                            </div>
                        </div>
                        <div className="size-10 rounded-full bg-[#fbfaf9] flex items-center justify-center text-[#796189] group-hover:translate-x-1 transition-transform">
                            <ArrowRight size={20} />
                        </div>
                    </Link>
                </div>
            </section>

            {/* Recent Activity Table */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[#1a151f] text-xl font-bold font-display tracking-tight">Actividad Reciente</h2>
                    <a className="text-[#6200EA] text-sm font-semibold hover:underline" href="#">Ver todo</a>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#f3f0f4] bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#fbfaf9] text-[#645c6e] uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4" scope="col">Usuario</th>
                                    <th className="px-6 py-4" scope="col">Acción</th>
                                    <th className="px-6 py-4" scope="col">Fecha</th>
                                    <th className="px-6 py-4 text-right" scope="col">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f3f0f4]">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#1a151f] flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">JP</div>
                                        Juan Perez
                                    </td>
                                    <td className="px-6 py-4 text-[#645c6e]">Aplicó a "Desarrollador Senior"</td>
                                    <td className="px-6 py-4 text-[#645c6e]">Hace 2 horas</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Nuevo</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#1a151f] flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">MT</div>
                                        Maria Torres
                                    </td>
                                    <td className="px-6 py-4 text-[#645c6e]">Actualizó su perfil</td>
                                    <td className="px-6 py-4 text-[#645c6e]">Hace 5 horas</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Revisado</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#1a151f] flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">TC</div>
                                        Tech Corp
                                    </td>
                                    <td className="px-6 py-4 text-[#645c6e]">Publicó nueva vacante</td>
                                    <td className="px-6 py-4 text-[#645c6e]">Ayer</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Activo</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
