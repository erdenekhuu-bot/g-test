import AuthUserSyncService from "./modules/sync_authuser_service";
import EmployeeSyncService from "./modules/sync_employee_service";
import DepartmentSyncService from "./modules/sync_department_service";
import JobPositionSyncService from "./modules/sync_jobposition_service";
import JobPositionGroupSyncService from "./modules/sync_jobPositionGroup_service";

const authUserSyncService = new AuthUserSyncService();
const employeeSyncService = new EmployeeSyncService();
const departmentSyncService = new DepartmentSyncService();
const jobPositionSyncService = new JobPositionSyncService();
const jobPositionGroupSyncService = new JobPositionGroupSyncService();
export async function runSync() {
     try {
          await Promise.all([
               await authUserSyncService.sync(),
               await departmentSyncService.sync(),
               await jobPositionGroupSyncService.sync(),
          ]);
          await jobPositionSyncService.sync();
          await employeeSyncService.sync();
     } catch (error) {
          console.error("❌ Sync хийх явцад алдаа гарлаа:", error);
     }
}
